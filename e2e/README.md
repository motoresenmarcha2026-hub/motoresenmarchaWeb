# Tests E2E (Playwright)

```bash
npm run test:e2e              # corre todo (levanta next dev solo)
npx playwright test --ui      # modo interactivo
npx playwright show-report    # ver último reporte HTML
```

Los tests corren contra `localhost:3000` con el Supabase real, así que cada
corrida crea usuarios `e2e.*@mecaweb.mx` y (posiblemente) talleres, citas y
solicitudes de prueba.

## Limpieza después de correr los tests

Pegar en el SQL Editor de Supabase:

```sql
-- 1) talleres de prueba primero (owner_id no cascadea)
DELETE FROM public.talleres
WHERE owner_id IN (SELECT id FROM auth.users WHERE email LIKE 'e2e.%@mecaweb.mx')
   OR nombre LIKE 'E2E Taller %';
-- 2) usuarios (cascadea profiles/citas/solicitudes)
DELETE FROM auth.users WHERE email LIKE 'e2e.%@mecaweb.mx';
```
