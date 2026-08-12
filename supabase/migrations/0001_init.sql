-- Motores en Marcha — esquema inicial
-- Mapea los types.ts de las features. Ejecutar en el SQL Editor de Supabase.

-- ============================================================
-- TALLERES (público: lectura para todos)
-- ============================================================
create table if not exists public.talleres (
  id text primary key,
  nombre text not null,
  slug text unique not null,
  especialidades text[] not null default '{}',
  rating numeric(2,1) not null default 0,
  num_resenas integer not null default 0,
  disponibilidad text not null default 'available'
    check (disponibilidad in ('available','busy')),
  lat double precision,
  lng double precision,
  direccion text,
  ciudad text,
  distancia_km numeric(5,1),
  eta_min integer,
  foto_url text,
  avatar_url text,
  whatsapp text,
  descripcion text,
  mecanico_principal text,
  horarios jsonb not null default '[]',
  precio_desde integer,
  verificado boolean not null default false,
  destacado boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- RESEÑAS (público: lectura; escritura por usuarios autenticados)
-- ============================================================
create table if not exists public.resenas (
  id uuid primary key default gen_random_uuid(),
  taller_id text not null references public.talleres(id) on delete cascade,
  conductor_id uuid references auth.users(id) on delete set null,
  autor text not null,
  autor_avatar_url text,
  rating integer not null check (rating between 1 and 5),
  comentario text,
  servicio text,
  created_at timestamptz not null default now()
);
create index if not exists resenas_taller_id_idx on public.resenas(taller_id);

-- ============================================================
-- SOLICITUDES (privado: dueño conductor / taller destino)
-- ============================================================
create table if not exists public.solicitudes (
  id uuid primary key default gen_random_uuid(),
  conductor_id uuid references auth.users(id) on delete cascade,
  taller_id text references public.talleres(id) on delete set null,
  tipo_problema text not null,
  descripcion text,
  lat double precision,
  lng double precision,
  direccion text,
  prioridad text not null default 'normal'
    check (prioridad in ('normal','urgente','emergencia')),
  estado text not null default 'pendiente'
    check (estado in ('pendiente','agendado','completado','rechazado')),
  cliente_nombre text,
  cliente_telefono text,
  vehiculo text,
  created_at timestamptz not null default now()
);
create index if not exists solicitudes_taller_id_idx on public.solicitudes(taller_id);

-- ============================================================
-- CITAS (privado: dueño conductor / taller)
-- ============================================================
create table if not exists public.citas (
  id uuid primary key default gen_random_uuid(),
  solicitud_id uuid references public.solicitudes(id) on delete set null,
  conductor_id uuid references auth.users(id) on delete cascade,
  taller_id text references public.talleres(id) on delete set null,
  taller_nombre text,
  cliente_nombre text,
  fecha date not null,
  hora text not null,
  servicio text,
  estado text not null default 'pendiente'
    check (estado in ('pendiente','confirmada','completada','cancelada')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.talleres    enable row level security;
alter table public.resenas     enable row level security;
alter table public.solicitudes enable row level security;
alter table public.citas       enable row level security;

-- Talleres: lectura pública (catálogo del marketplace).
drop policy if exists talleres_public_read on public.talleres;
create policy talleres_public_read on public.talleres
  for select to anon, authenticated using (true);

-- Reseñas: lectura pública; inserta solo el autor autenticado.
drop policy if exists resenas_public_read on public.resenas;
create policy resenas_public_read on public.resenas
  for select to anon, authenticated using (true);

drop policy if exists resenas_insert_own on public.resenas;
create policy resenas_insert_own on public.resenas
  for insert to authenticated with check (auth.uid() = conductor_id);

-- Solicitudes: el conductor ve/gestiona las suyas.
-- TODO: agregar policy para que el taller vea las solicitudes dirigidas a él.
drop policy if exists solicitudes_own on public.solicitudes;
create policy solicitudes_own on public.solicitudes
  for all to authenticated
  using (auth.uid() = conductor_id)
  with check (auth.uid() = conductor_id);

-- Citas: el conductor ve/gestiona las suyas.
drop policy if exists citas_own on public.citas;
create policy citas_own on public.citas
  for all to authenticated
  using (auth.uid() = conductor_id)
  with check (auth.uid() = conductor_id);
