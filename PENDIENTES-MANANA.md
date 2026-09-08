# Pendientes para retomar — rol vendedor + refacciones

> Escrito el 2026-09-02. El código de la feature **ya está completo y compila**
> (`tsc`, `eslint`, `next build` en verde), pero **NADA se ha corrido en Supabase
> ni se ha commiteado a git**. Todo vive en el working tree sin commit.

---

## ⛳ Estado actual (dónde quedamos)

- ✅ Toda la implementación del **rol `vendedor`** y el **marketplace de refacciones**
  está escrita (ver "Archivos" abajo).
- ✅ Verificado local: `npx tsc --noEmit`, `npm run lint`, `npm run build` sin errores.
- ❌ **NO se corrió la migración `0006` en Supabase** (Antigravity se buggeó antes).
- ❌ **NO hay commit** — 24 archivos modificados + carpetas nuevas sin trackear.
- ❌ **NO se probó el flujo end-to-end** (falta la DB).

Sin la migración, la app **no falla**: las vistas de refacciones muestran su estado
vacío porque las tablas aún no existen / no hay datos.

---

## ✅ Qué hacer mañana (en orden)

### 1. Correr la migración en Supabase (BLOQUEANTE — es lo único que falta para probar)
El pegado automatizado en el editor Monaco de Supabase no funciona (nota conocida del
proyecto), así que:

```bash
cd ~/Desktop/Daniel/NewProjects/MecaWeb
pbcopy < supabase/migrations/0006_vendedores_refacciones.sql
```

Luego, en el **SQL Editor** de Supabase (proyecto `ygxxsgypnoflqbwrrlxq`):
pegar (⌘V) y **Run**. La migración es idempotente.

**Qué crea:** constraint de rol con los 4 roles · tablas `vendedores` y `refacciones`
· RLS · `handle_new_user()` extendido (crea la tienda al registrarse) · bucket
Storage `refacciones`.

**Verificar tras correr:**
- `select * from public.vendedores;` y `select * from public.refacciones;` no dan error.
- En Storage aparece el bucket `refacciones` (público).
- `select tablename, policyname from pg_policies where tablename in ('vendedores','refacciones');`
  muestra las policies.

### 2. Probar el flujo (con `npm run dev`)
```bash
npm run dev   # http://localhost:3000
```
- **Registro** `/registro/vendedor` → debe crear perfil `vendedor` + fila en `vendedores`
  (por el trigger). El login redirige a `/vendedor/refacciones`.
- **Inventario** `/vendedor/refacciones`: crear una refacción con foto, editarla, borrarla.
- **Tienda** `/vendedor/cuenta`: editar datos + subir logo.
- **Marketplace** `/refacciones`: aparece el producto, filtros por categoría/precio/texto,
  detalle `/refacciones/[id]`, botón WhatsApp abre `wa.me` con mensaje prellenado.
- **Home**: sección "Refacciones destacadas" (marca `destacado=true` en la BD a mano para verla).
- **Admin** `/admin`: conteos y paneles de vendedores/refacciones.
- **Proxy**: `/vendedor/*` redirige a `/login` sin sesión.

### 3. Commit + push
Nada se ha commiteado. Cuando el flujo esté probado:
```bash
git add -A
git commit -m "feat: rol vendedor + marketplace de refacciones"
git push
```
(Ojo: `meca2.pen` también aparece sin trackear — decidir si se commitea o se ignora.)

---

## ⚠️ Gotchas ya resueltos (para no re-romper)
- El constraint de rol en `0006` re-agrega los **4** roles (`conductor,taller,admin,vendedor`);
  no quitar `admin` o se rompen los admins.
- Slug de refacciones es único **por vendedor** (índice compuesto), no global. El ruteo es por `id`.
- Foto de producto: la fila se crea primero (para tener `id`) y luego se sube la imagen a
  `refacciones/${userId}/${refaccionId}.ext` y se guarda la URL. El logo va a `${userId}/logo.ext`.

## 🔮 Fuera de alcance (posible trabajo futuro, NO pendiente inmediato)
- Reseñas de refacciones/vendedores (hoy no hay; se reusaría el patrón de `resenas` de talleres).
- Pagos / carrito (hoy solo contacto por WhatsApp).
- Seed de refacciones de ejemplo (hoy no hay datos de prueba).
- Tests E2E para el flujo vendedor (seguir el patrón de `e2e/taller.spec.ts`).

---

## 📁 Archivos de esta feature

**Nuevos**
- `supabase/migrations/0006_vendedores_refacciones.sql`
- `src/features/vendedores/{types.ts, data.ts, actions.ts, components/FormCuentaVendedor.tsx}`
- `src/features/refacciones/{types.ts, mock.ts, data.ts, actions.ts}`
- `src/features/refacciones/components/{InventarioRefacciones, RefaccionesCliente, TarjetaRefaccion, PerfilRefaccion}.tsx`
- `src/features/usuarios/components/FormRegistroVendedor.tsx`
- `src/app/(auth)/registro/vendedor/page.tsx`
- `src/app/refacciones/page.tsx`, `src/app/refacciones/[id]/page.tsx`
- `src/app/vendedor/refacciones/page.tsx`, `src/app/vendedor/cuenta/page.tsx`

**Modificados**
- `src/lib/auth/dal.ts` (Rol + `requireVendedor`)
- `src/features/usuarios/{actions.ts, types.ts, nav.ts, shell.ts}`
- `src/features/usuarios/components/{SelectorTipoUsuario, OnboardingForm, ConfirmacionContenido}.tsx`
- `src/components/layout/{AuthNav, Header}.tsx`
- `src/app/auth/callback/route.ts`, `src/proxy.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`
- `src/app/page.tsx` (sección destacadas)
- `src/features/admin/data.ts`, `src/app/admin/page.tsx`
- `ESTADO-Y-PENDIENTES.md` (Fase 9)

> Nota: `DashboardShell.tsx`, `panel/*` y `admin/cuenta` también aparecen modificados por
> la limpieza previa (helpers `tallerShell`/`adminShell` y fix del botón "Cerrar sesión").
