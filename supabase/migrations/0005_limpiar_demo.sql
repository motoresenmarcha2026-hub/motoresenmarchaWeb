-- 0005: función para eliminar los datos de demostración (seed) desde el panel admin.
-- "Demo" = talleres sin dueño (owner_id IS NULL, los del seed) + sus reseñas,
-- citas y solicitudes. Los talleres reales (con owner_id) no se tocan.
-- Ejecutar en el SQL Editor de Supabase. Idempotente.

set local search_path = public;

create or replace function public.limpiar_datos_demo()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_citas int;
  v_solicitudes int;
  v_resenas int;
  v_talleres int;
begin
  if not public.is_admin() then
    raise exception 'Solo el administrador puede ejecutar esta acción';
  end if;

  -- Citas y solicitudes dirigidas a talleres de demo
  delete from public.citas c
    using public.talleres t
    where c.taller_id = t.id and t.owner_id is null;
  get diagnostics v_citas = row_count;

  delete from public.solicitudes s
    using public.talleres t
    where s.taller_id = t.id and t.owner_id is null;
  get diagnostics v_solicitudes = row_count;

  -- Las reseñas caen en cascada al borrar el taller; contamos antes
  select count(*) into v_resenas
    from public.resenas r
    where r.taller_id in (select id from public.talleres where owner_id is null);

  delete from public.talleres where owner_id is null;
  get diagnostics v_talleres = row_count;

  return jsonb_build_object(
    'talleres', v_talleres,
    'resenas', v_resenas,
    'citas', v_citas,
    'solicitudes', v_solicitudes
  );
end;
$$;

-- Nadie anónimo puede llamarla; los autenticados pasan por el check is_admin()
revoke execute on function public.limpiar_datos_demo() from anon;
