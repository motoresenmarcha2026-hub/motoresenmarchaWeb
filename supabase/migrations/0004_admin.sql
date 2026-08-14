-- 0004: rol admin + lectura total para revisión de la plataforma.
-- Ejecutar en el SQL Editor de Supabase. Idempotente.

set local search_path = public;

-- 1) Permitir el rol 'admin' en profiles
alter table public.profiles drop constraint if exists profiles_rol_check;
alter table public.profiles
  add constraint profiles_rol_check check (rol in ('conductor','taller','admin'));

-- 2) is_admin(): security definer para evitar recursión en policies de profiles
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and rol = 'admin'
  );
$$;

-- 3) El admin puede LEER todo (talleres y resenas ya son de lectura pública)
drop policy if exists profiles_admin_read on public.profiles;
create policy profiles_admin_read on public.profiles
  for select using (public.is_admin());

drop policy if exists solicitudes_admin_read on public.solicitudes;
create policy solicitudes_admin_read on public.solicitudes
  for select using (public.is_admin());

drop policy if exists citas_admin_read on public.citas;
create policy citas_admin_read on public.citas
  for select using (public.is_admin());

-- 4) Promover la cuenta admin (si ya existe en auth.users).
--    Si aún no se ha registrado, registrarla primero (email o Google) y
--    volver a correr SOLO este UPDATE.
update public.profiles p
set rol = 'admin'
from auth.users u
where p.id = u.id
  and u.email = 'motoresenmarcha2026@gmail.com';
