-- Motores en Marcha — Panel del taller, Realtime, rating y Storage.
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de 0002_auth.sql.

-- ============================================================
-- 1. CITAS: el taller ve las citas de talleres que posee
-- ============================================================
drop policy if exists citas_taller_read on public.citas;
create policy citas_taller_read on public.citas
  for select to authenticated
  using (taller_id in (select id from public.talleres where owner_id = auth.uid()));

-- ============================================================
-- 2. SOLICITUDES: el taller puede actualizar (aceptar/rechazar) las suyas
--    (la policy de SELECT `solicitudes_taller_read` ya existe en 0002)
-- ============================================================
drop policy if exists solicitudes_taller_update on public.solicitudes;
create policy solicitudes_taller_update on public.solicitudes
  for update to authenticated
  using (taller_id in (select id from public.talleres where owner_id = auth.uid()))
  with check (taller_id in (select id from public.talleres where owner_id = auth.uid()));

-- ============================================================
-- 3. Recalcular rating / num_resenas del taller al cambiar reseñas
--    security definer: la reseña la inserta un conductor sin permiso de
--    UPDATE sobre talleres, así que el recálculo corre con privilegios.
-- ============================================================
create or replace function public.recalcular_rating_taller()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_taller_id text := coalesce(new.taller_id, old.taller_id);
begin
  update public.talleres t set
    num_resenas = sub.cnt,
    rating = round(coalesce(sub.avg_rating, 0), 1)
  from (
    select count(*)::int as cnt, avg(rating)::numeric as avg_rating
    from public.resenas
    where taller_id = v_taller_id
  ) sub
  where t.id = v_taller_id;
  return null; -- AFTER trigger: el retorno se ignora
end;
$$;

drop trigger if exists resenas_recalcular_rating on public.resenas;
create trigger resenas_recalcular_rating
  after insert or update or delete on public.resenas
  for each row execute function public.recalcular_rating_taller();

-- ============================================================
-- 4. Realtime: publicar solicitudes y citas (idempotente)
-- ============================================================
do $$
begin
  begin
    alter publication supabase_realtime add table public.solicitudes;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.citas;
  exception when duplicate_object then null;
  end;
end $$;
-- Verificar:  select tablename from pg_publication_tables where pubname = 'supabase_realtime';

-- ============================================================
-- 5. Storage: bucket público 'talleres' + policies por carpeta = auth.uid()
--    Convención de path: `${auth.uid()}/foto.<ext>`
-- ============================================================
insert into storage.buckets (id, name, public)
values ('talleres', 'talleres', true)
on conflict (id) do update set public = true;

drop policy if exists talleres_storage_public_read on storage.objects;
create policy talleres_storage_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'talleres');

drop policy if exists talleres_storage_insert_own on storage.objects;
create policy talleres_storage_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'talleres'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists talleres_storage_update_own on storage.objects;
create policy talleres_storage_update_own on storage.objects
  for update to authenticated
  using (bucket_id = 'talleres' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'talleres' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists talleres_storage_delete_own on storage.objects;
create policy talleres_storage_delete_own on storage.objects
  for delete to authenticated
  using (bucket_id = 'talleres' and (storage.foldername(name))[1] = auth.uid()::text);
