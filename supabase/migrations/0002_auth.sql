-- Motores en Marcha — Auth
-- profiles ligado a auth.users, owner_id en talleres, trigger de alta y RLS.
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de 0001_init.sql.

-- ============================================================
-- PROFILES (perfil de la app ligado a auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  rol text not null check (rol in ('conductor','taller')),
  nombre text,
  telefono text,
  ciudad text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cada quien ve / crea / edita su propio perfil.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- ============================================================
-- TALLERES: dueño (auth.user) de la fila
-- ============================================================
alter table public.talleres
  add column if not exists owner_id uuid references auth.users(id) on delete set null;

drop policy if exists talleres_insert_own on public.talleres;
create policy talleres_insert_own on public.talleres
  for insert to authenticated with check (auth.uid() = owner_id);

drop policy if exists talleres_update_own on public.talleres;
create policy talleres_update_own on public.talleres
  for update to authenticated
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ============================================================
-- SOLICITUDES: el taller ve las dirigidas a talleres que posee
-- (deja listo el pendiente #3 — panel del taller)
-- ============================================================
drop policy if exists solicitudes_taller_read on public.solicitudes;
create policy solicitudes_taller_read on public.solicitudes
  for select to authenticated
  using (taller_id in (select id from public.talleres where owner_id = auth.uid()));

-- ============================================================
-- Helper: slug a partir de texto libre
-- ============================================================
create or replace function public.slugify(txt text)
returns text language sql immutable as $$
  select trim(both '-' from
    regexp_replace(lower(coalesce(txt, '')), '[^a-z0-9]+', '-', 'g'));
$$;

-- ============================================================
-- Trigger de alta: crea el perfil (y la fila taller) al registrarse.
-- Solo actúa si el signup trae `rol` en los metadatos (camino email).
-- Los usuarios de Google NO traen rol → completan su perfil en /onboarding.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_rol       text := new.raw_user_meta_data->>'rol';
  v_taller_id text;
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

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
