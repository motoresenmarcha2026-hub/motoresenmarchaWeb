-- 0006: rol 'vendedor' + tiendas (vendedores) y catálogo de refacciones.
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de 0004_admin.sql. Idempotente.

set local search_path = public;

-- ============================================================
-- 1. Rol 'vendedor' en profiles (re-agregar el constraint con LOS 4 roles;
--    0004 lo dejó en conductor/taller/admin — omitir 'admin' rompería admins)
-- ============================================================
alter table public.profiles drop constraint if exists profiles_rol_check;
alter table public.profiles
  add constraint profiles_rol_check
  check (rol in ('conductor','taller','admin','vendedor'));

-- ============================================================
-- 2. VENDEDORES (la "tienda" del vendedor — espejo de talleres, PK text)
-- ============================================================
create table if not exists public.vendedores (
  id text primary key,
  owner_id uuid references auth.users(id) on delete set null,
  nombre_negocio text not null,
  slug text unique not null,
  ciudad text,
  direccion text,
  whatsapp text,
  logo_url text,
  descripcion text,
  categorias text[] not null default '{}',
  verificado boolean not null default false,
  destacado boolean not null default false,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

alter table public.vendedores enable row level security;

-- Lectura pública (marketplace); el dueño crea/edita su propia tienda.
drop policy if exists vendedores_public_read on public.vendedores;
create policy vendedores_public_read on public.vendedores
  for select to anon, authenticated using (true);

drop policy if exists vendedores_insert_own on public.vendedores;
create policy vendedores_insert_own on public.vendedores
  for insert to authenticated with check (auth.uid() = owner_id);

drop policy if exists vendedores_update_own on public.vendedores;
create policy vendedores_update_own on public.vendedores
  for update to authenticated
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists vendedores_admin_read on public.vendedores;
create policy vendedores_admin_read on public.vendedores
  for select using (public.is_admin());

-- ============================================================
-- 3. REFACCIONES (productos; muchas por vendedor). slug único POR vendedor.
-- ============================================================
create table if not exists public.refacciones (
  id text primary key,
  vendedor_id text not null references public.vendedores(id) on delete cascade,
  nombre text not null,
  slug text not null,
  categoria text,
  precio numeric(10,2) not null default 0,
  moneda text not null default 'MXN',
  stock integer not null default 0,
  marca text,
  modelo_compatible text,
  foto_url text,
  descripcion text,
  activo boolean not null default true,
  destacado boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists refacciones_vendedor_id_idx on public.refacciones(vendedor_id);
create index if not exists refacciones_categoria_idx on public.refacciones(categoria);
create unique index if not exists refacciones_vendedor_slug_uk
  on public.refacciones(vendedor_id, slug);

alter table public.refacciones enable row level security;

-- Lectura pública; el dueño (vía su tienda) inserta/edita/borra sus productos.
drop policy if exists refacciones_public_read on public.refacciones;
create policy refacciones_public_read on public.refacciones
  for select to anon, authenticated using (true);

drop policy if exists refacciones_insert_own on public.refacciones;
create policy refacciones_insert_own on public.refacciones
  for insert to authenticated
  with check (vendedor_id in (select id from public.vendedores where owner_id = auth.uid()));

drop policy if exists refacciones_update_own on public.refacciones;
create policy refacciones_update_own on public.refacciones
  for update to authenticated
  using (vendedor_id in (select id from public.vendedores where owner_id = auth.uid()))
  with check (vendedor_id in (select id from public.vendedores where owner_id = auth.uid()));

drop policy if exists refacciones_delete_own on public.refacciones;
create policy refacciones_delete_own on public.refacciones
  for delete to authenticated
  using (vendedor_id in (select id from public.vendedores where owner_id = auth.uid()));

drop policy if exists refacciones_admin_read on public.refacciones;
create policy refacciones_admin_read on public.refacciones
  for select using (public.is_admin());

-- ============================================================
-- 4. Trigger de alta: extender handle_new_user() para crear la fila
--    `vendedores` cuando el signup trae rol='vendedor'. Se conservan las
--    ramas conductor + taller idénticas a 0002; solo se agrega vendedor.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_rol         text := new.raw_user_meta_data->>'rol';
  v_taller_id   text;
  v_vendedor_id text;
begin
  if v_rol is null then
    return new; -- Google / sin rol: lo maneja /onboarding
  end if;

  insert into public.profiles (id, rol, nombre, telefono, ciudad)
  values (
    new.id,
    v_rol,
    new.raw_user_meta_data->>'nombre',
    new.raw_user_meta_data->>'telefono',
    new.raw_user_meta_data->>'ciudad'
  );

  if v_rol = 'taller' then
    v_taller_id := gen_random_uuid()::text;
    insert into public.talleres
      (id, nombre, slug, ciudad, direccion, whatsapp, especialidades, owner_id)
    values (
      v_taller_id,
      coalesce(new.raw_user_meta_data->>'taller_nombre', 'Taller'),
      public.slugify(coalesce(new.raw_user_meta_data->>'taller_nombre', 'taller'))
        || '-' || substr(v_taller_id, 1, 6),
      new.raw_user_meta_data->>'ciudad',
      new.raw_user_meta_data->>'direccion',
      new.raw_user_meta_data->>'telefono',
      coalesce(
        (select array(select jsonb_array_elements_text(new.raw_user_meta_data->'especialidades'))),
        '{}'::text[]
      ),
      new.id
    );
  end if;

  if v_rol = 'vendedor' then
    v_vendedor_id := gen_random_uuid()::text;
    insert into public.vendedores
      (id, nombre_negocio, slug, ciudad, direccion, whatsapp, categorias, owner_id)
    values (
      v_vendedor_id,
      coalesce(new.raw_user_meta_data->>'negocio_nombre', 'Refaccionaria'),
      public.slugify(coalesce(new.raw_user_meta_data->>'negocio_nombre', 'refaccionaria'))
        || '-' || substr(v_vendedor_id, 1, 6),
      new.raw_user_meta_data->>'ciudad',
      new.raw_user_meta_data->>'direccion',
      new.raw_user_meta_data->>'telefono',
      coalesce(
        (select array(select jsonb_array_elements_text(new.raw_user_meta_data->'categorias'))),
        '{}'::text[]
      ),
      new.id
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 5. Storage: bucket público 'refacciones' + policies por carpeta = auth.uid()
--    Convención de path: `${auth.uid()}/logo.<ext>` (tienda) y
--    `${auth.uid()}/${refaccionId}.<ext>` (cada producto).
-- ============================================================
insert into storage.buckets (id, name, public)
values ('refacciones', 'refacciones', true)
on conflict (id) do update set public = true;

drop policy if exists refacciones_storage_public_read on storage.objects;
create policy refacciones_storage_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'refacciones');

drop policy if exists refacciones_storage_insert_own on storage.objects;
create policy refacciones_storage_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'refacciones'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists refacciones_storage_update_own on storage.objects;
create policy refacciones_storage_update_own on storage.objects
  for update to authenticated
  using (bucket_id = 'refacciones' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'refacciones' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists refacciones_storage_delete_own on storage.objects;
create policy refacciones_storage_delete_own on storage.objects
  for delete to authenticated
  using (bucket_id = 'refacciones' and (storage.foldername(name))[1] = auth.uid()::text);
