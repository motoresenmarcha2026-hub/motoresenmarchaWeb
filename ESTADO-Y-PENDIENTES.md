# Motores en Marcha — Estado y pendientes

> Marketplace web que conecta conductores con mecánicos/talleres, con flujo de
> ayuda de emergencia (SOS/WhatsApp). Stack: **Next.js 16 (App Router) · React 19 ·
> TypeScript · Tailwind v4 · Supabase**. Arquitectura **feature-based** en `src/features/*`.
>
> Última actualización: sesión del 2026-08-14.

---

## ✅ Lo que YA está hecho

### Fase 1 — Frontend completo (datos mock)
- Proyecto Next.js 16 + TS + Tailwind v4 + ESLint (`src/`, alias `@/*`).
- **Design tokens** del diseño Pencil (`meca2.pen`) en `src/app/globals.css` (`@theme`):
  colores, tipografías (Funnel Sans / Inter / Geist / Geist Mono vía `next/font`), espaciado.
- **16 rutas / 15+ pantallas** construidas y verificadas visualmente contra el diseño:
  - Home `/`, Talleres Marketplace `/talleres`, Perfil `/talleres/[id]`.
  - Solicitud `/solicitar`, Panel taller `/panel/solicitudes` y `/panel/cuenta`.
  - Registro `(auth)/registro` (tipo, conductor, taller), Login `/login`, Confirmación `/confirmacion`.
  - Citas `/citas/mis-citas`, `/citas/agendar/[tallerId]`, Calificar `/calificar/[servicioId]`.
  - Cuentas `/cuenta` (conductor), `/admin/cuenta`.
  - Modal "Talleres cercanos" (dentro de `/talleres`).
- **Componentes reutilizables**: `components/ui/` (Button 6 variantes, Badge, Rating, Tag,
  FormField, Modal, CategoryCard, Icono) y `components/layout/` (Header responsive,
  Footer, SOSFloatingButton, DashboardShell).
- **Tipos** (`features/*/types.ts`) diseñados para mapear a Postgres, y **mocks** realistas.

### Fase 2 — Supabase (parcial: lectura de talleres/reseñas)
- Proyecto Supabase creado (**ref: `ygxxsgypnoflqbwrrlxq`**, plan Free, región Americas, RLS auto ON).
- `@supabase/supabase-js` + `@supabase/ssr` instalados.
- Clientes: `src/lib/supabase/client.ts` (browser) y `server.ts` (server, con cookies).
- **Esquema SQL** ejecutado: `supabase/migrations/0001_init.sql`
  (tablas `talleres`, `resenas`, `solicitudes`, `citas` + RLS).
- **Seed** ejecutado: `supabase/seed.sql` (8 talleres + 5 reseñas).
- **RLS**: lectura pública de `talleres` y `resenas`; policies por dueño (aún inactivas
  hasta que haya Auth) para `solicitudes`, `citas`, `resenas.insert`.
- **Capa de datos** con fallback a mock: `features/talleres/data.ts`, `features/resenas/data.ts`.
- **Conectados a Supabase**: `/talleres` (server + filtro cliente), Home destacados, Perfil + reseñas.

### Infra / Deploy
- Repo GitHub: `motoresenmarcha2026-hub/motoresenmarchaWeb` (rama `main`).
- **SSH** configurado: llave dedicada `~/.ssh/id_ed25519_motoresenmarcha`, host alias
  `github-motoresenmarcha` en `~/.ssh/config`. `git push`/`pull` normales ya usan SSH.
- **Vercel**: proyecto `motoresenmarcha-web` (único — el duplicado `-ay37` fue eliminado).
  - Env vars `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` configuradas (Prod+Preview).
  - **Producción verificada leyendo de Supabase** (orden por distancia ≠ orden mock).

---

## ✅ Fase 3 — Auth (HECHO, verificado en local — sesión 2026-08-13)

- **Email + password** para conductor y taller, y **Google OAuth** (con onboarding para elegir rol).
- **Migración** `supabase/migrations/0002_auth.sql` (ejecutada en Supabase):
  tabla `profiles` (rol/nombre/telefono/ciudad ligada a `auth.users`), `talleres.owner_id`,
  trigger `handle_new_user` (crea perfil + fila `talleres` si el signup trae `rol`),
  RLS: `profiles_*`, `talleres_insert_own`/`update_own`, `solicitudes_taller_read` (listo para #3).
- **Sesión (Next 16):** `src/proxy.ts` (¡NO `middleware.ts`! — en Next 16 se llama **Proxy**) +
  `src/lib/supabase/session.ts`. DAL en `src/lib/auth/dal.ts` (`getUser`/`getPerfil`/`requirePerfil`).
- **Server actions:** `src/features/usuarios/actions.ts` (registrar/iniciarSesion/cerrarSesion/
  iniciarConGoogle/completarPerfil). Formularios conectados con `useActionState`.
- **Google:** callback `src/app/auth/callback/route.ts`; onboarding `/onboarding` (elige conductor/taller);
  `BotonGoogle` en login + ambos registros. Header con estado de sesión (`AuthNav`).
- **Verificado en local:** registro conductor/taller (con fila `talleres` + owner_id + especialidades),
  login con redirect por rol (taller→`/panel/solicitudes`), logout, proxy protegiendo rutas.
- **Config de dashboards hecha:** SQL corrido · "Confirm email" OFF (MVP) · Redirect URLs
  (`localhost:3000/**` + `motoresenmarcha-web.vercel.app/**`).
- ✅ **Google OAuth HECHO y verificado en producción** (sesión 2026-08-13): OAuth Client creado
  en Google Cloud (proyecto `talleres-505501`), Client ID + Secret en Supabase, provider habilitado.
  Login con Google probado end-to-end en `localhost` y en `https://www.motoresenmarcha.com`.
- ✅ **Desplegado a producción** y **dominio en vivo**: `motoresenmarcha.com`
  (redirige a `www`), DNS en IONOS (A `@`→`216.198.79.1`, CNAME `www`→Vercel), SSL automático.
- ✅ **Supabase Redirect URLs** incluyen `motoresenmarcha.com/**` y `www.motoresenmarcha.com/**`.
- ✅ **App OAuth PUBLICADA** (modo producción) — cualquier usuario con cuenta Google puede entrar.
- Nota menor: el `slugify` SQL no quita acentos (`Rápido`→`r-pido`); cosmético, el slug es único.

### 🔧 Google OAuth — referencia
- OAuth Client (Web) en Google Cloud proyecto `talleres-505501`; redirect URI del cliente:
  `https://ygxxsgypnoflqbwrrlxq.supabase.co/auth/v1/callback`. Consent screen: **External**,
  app "Motores en Marcha", soporte `motoresenmarcha2026@gmail.com`.
- Client ID `305350890435-...apps.googleusercontent.com` + Secret pegados en Supabase → Google.

## ✅ Fase 4 — Escritura de datos (HECHO, sesión 2026-08-13)
- **Server actions** por feature: `features/solicitudes/actions.ts` (`guardarSolicitud`),
  `features/citas/actions.ts` (`agendarCita`), `features/resenas/actions.ts` (`enviarResena`).
  Todas usan el DAL (`getUser`/`getPerfil`) y escriben con RLS por dueño.
- **Solicitar servicio** (`/solicitar`): guarda en `solicitudes` al enviar por WhatsApp
  (fire-and-forget, no bloquea el SOS; solo persiste si hay sesión).
- **Agendar cita** (`/citas/agendar/[tallerId]`): inserta en `citas`. **Verificado end-to-end**.
- **Calificar** (`/calificar/[servicioId]`): inserta en `resenas` (policy `resenas_insert_own`);
  combina comentario + etiquetas destacadas.

## ✅ Fase 5 — Panel del taller + Realtime + limpieza (HECHO, sesión 2026-08-13)
- **Migración** `supabase/migrations/0003_panel_realtime.sql` (ejecutada): policies
  `citas_taller_read` y `solicitudes_taller_update`; trigger `recalcular_rating_taller`
  (recalcula `talleres.rating`/`num_resenas` al cambiar reseñas); realtime en `solicitudes`+`citas`;
  bucket Storage `talleres` (público) + policies por carpeta `auth.uid()`.
- **Capa de lectura sin fallback:** `solicitudes/data.ts`, `citas/data.ts`, `talleres/data.ts`.
  Mapper puro `solicitudes/mappers.ts` (compartido server↔client).
- **Panel real:** `/panel/solicitudes` con Realtime, botón Rechazar, `/panel/cuenta` con
  edición de datos + subida de foto a Storage. **Verificado end-to-end**.
- **Gotcha Realtime:** el socket necesita `supabase.realtime.setAuth(session.access_token)`
  para que RLS entregue eventos; canal con nombre único por montaje (evita bug en StrictMode).

## ✅ Fase 6 — Limpieza y consistencia de datos (HECHO, sesión 2026-08-14)

- **`getTallerPorId` / `getTallerPorSlug` eliminados del flujo real:**
  - `/citas/agendar/[tallerId]/page.tsx` → usa `getTaller(id)` de `data.ts` (DB).
  - `FormularioSolicitud` → ya no usa mock; recibe `taller` y `clienteNombre` como props
    desde el page (server), que llama `getTaller` + `getPerfil`.
- **Imágenes del seed migradas a Storage:** `scripts/migrate-images.mjs` descargó las 16
  imágenes de picsum.photos (8 foto_url + 8 avatar_url) y las subió al bucket `talleres`;
  `foto_url`/`avatar_url` en la tabla ahora apuntan a Supabase Storage.
- **Logo real** en Header, Footer y OpenGraph (`public/logo.png`, `src/app/icon.png`).
- **Datos de prueba eliminados** (`ana.conductora@mecaweb.mx`, `taller.rapido@mecaweb.mx`
  y su taller de prueba borrados de `auth.users` en cascada).
- **Proyecto Vercel duplicado** `motoresenmarcha-web-ay37` eliminado — queda solo
  `motoresenmarcha-web`.
- Commit `6f0e078` desplegado en producción.

---

## 🔜 Pendientes (cuando quieras)
- **Tests + CI** (Vitest + GitHub Actions) — pospuesto desde el inicio.

---

## 📌 Notas técnicas / trampas conocidas

- **Tailwind v4 — colisión de tokens**: los tokens de spacing con nombre (`xs/sm/md/lg/xl/2xl`)
  colisionan con las utilidades `max-w-*`/`min-w-*` (leen del namespace de spacing).
  ⚠️ **No usar `max-w-{xs,sm,md,lg,xl,2xl}`** → usar valores arbitrarios (`max-w-[28rem]`) o `max-w-7xl`.
  Radios, `text-*` y breakpoints `md:` NO se ven afectados.
- **Config de Tailwind es CSS-first** (`@theme` en `globals.css`), NO hay `tailwind.config.ts`.
- **`.env.local` NO se commitea** (está en `.gitignore` como `.env*`). Las mismas variables
  viven en Vercel → Settings → Environment Variables.
- **Ejecutar SQL**: el pegado automatizado en el editor Monaco de Supabase no funciona;
  se corre copiando el SQL al portapapeles (`pbcopy`) y pegando manualmente en el SQL Editor.
- **Fuente de la verdad del diseño**: archivo Pencil `~/Desktop/meca2.pen` (usar MCP `pencil`).
- **`SUPABASE_SERVICE_ROLE_KEY`**: solo en `.env.local` local (nunca al repo). Se usa para
  scripts de administración como `scripts/migrate-images.mjs`. La key legacy (JWT) está en
  Supabase → Settings → API Keys → "Legacy anon, service_role API keys".

---

## 🔑 Referencias rápidas

| Recurso | Valor |
|---|---|
| Repo GitHub | `motoresenmarcha2026-hub/motoresenmarchaWeb` (rama `main`) |
| Remote SSH | `git@github-motoresenmarcha:motoresenmarcha2026-hub/motoresenmarchaWeb.git` |
| Producción | https://www.motoresenmarcha.com |
| Proyecto Vercel | `motores-en-marcha/motoresenmarcha-web` |
| Supabase project ref | `ygxxsgypnoflqbwrrlxq` |
| Supabase URL | `https://ygxxsgypnoflqbwrrlxq.supabase.co` |
| Supabase dashboard | https://supabase.com/dashboard/project/ygxxsgypnoflqbwrrlxq |
| Diseño Pencil | `~/Desktop/meca2.pen` |

> La **publishable key** (anon) es pública y está en `.env.local` + Vercel.
> La **service_role key** y la **DB password** son secretas — guárdalas fuera del repo.

---

## ▶️ Cómo retomar

```bash
cd ~/Desktop/MecaWeb
npm run dev          # http://localhost:3000 (usa .env.local → Supabase)
```
