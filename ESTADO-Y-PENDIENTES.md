# Motores en Marcha — Estado y pendientes

> Marketplace web que conecta conductores con mecánicos/talleres, con flujo de
> ayuda de emergencia (SOS/WhatsApp). Stack: **Next.js 16 (App Router) · React 19 ·
> TypeScript · Tailwind v4 · Supabase**. Arquitectura **feature-based** en `src/features/*`.
>
> Última actualización: sesión del 2026-08-14 (tarde).
> **✅ PROYECTO ENTREGADO AL CLIENTE el 2026-08-14.**

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

## ✅ Fase 7 — Sin mock + Tests E2E + Legales + entrega (HECHO, sesión 2026-08-14 tarde)

### Últimas pantallas mock → datos reales
- `/citas/mis-citas` → citas reales del conductor (`getCitasDelConductor` en `citas/data.ts`).
- `/cuenta` → perfil real (`requirePerfil` + email del user); se quitaron Vehículo/Placa (no existen en DB).
- `/calificar/[servicioId]` → carga la cita real (`getCita`), 404 si no existe.
- `TarjetaCita`: botón **Calificar** en citas completadas (cierra el ciclo cita → reseña).
- **Ya no queda ningún dato mock en la app** — solo catálogos estáticos (especialidades,
  tipos de problema, franjas horarias), lo cual es correcto.

### Tests E2E (Playwright) — 23 tests en verde
- `playwright.config.ts` + `e2e/{publico,conductor,taller}.spec.ts` + `e2e/README.md`.
- **Corren en puerto 3100** (el 3000 suele estar ocupado por otro proyecto).
- Cubren: home/marketplace/perfil desde DB, imágenes de Storage (verifica que no hay picsum),
  filtros, solicitar + popup wa.me, protección de rutas del proxy, registro/login/logout
  de conductor y taller, agendar cita end-to-end, mis-citas y cuenta con datos reales,
  panel del taller, páginas legales.
- Comando: `npm run test:e2e`. ⚠️ Cada corrida crea usuarios `e2e.*@mecaweb.mx` en el
  Supabase real — **correr el SQL de limpieza de `e2e/README.md` después**.

### Páginas legales
- `/terminos`, `/privacidad`, `/cookies` — layout compartido `(legal)` + `legal-ui.tsx`.
- Footer conectado (los 3 links legales + Contacto como mailto). "Sobre nosotros" se quitó
  (pendiente de contenido del cliente).
- Checkboxes de registro: "términos y condiciones" y "aviso de privacidad" son links reales.
- ⚠️ Recomendado: revisión de los textos por un abogado antes de uso formal.

### Favicon / ícono
- Eliminado `src/app/favicon.ico` (era el **triángulo default de Next.js** y le ganaba al logo
  en la pestaña del navegador). Ahora `src/app/icon.png` (logo, 256px) + `apple-icon.png` (180px).

### Limpieza hecha
- Datos de prueba borrados (usuarios de prueba, "Taller El Rápido Prueba", usuarios e2e).
- Proyecto Vercel duplicado `motoresenmarcha-web-ay37` eliminado.

### Rol admin + panel de administración
- **Migración `0004_admin.sql`**: rol `admin` en `profiles`, función `is_admin()`
  (security definer) y policies `*_admin_read` para leer profiles/solicitudes/citas.
  Promueve a **motoresenmarcha2026@gmail.com** (si la cuenta no existe aún: registrarla
  primero y volver a correr solo el UPDATE final).
- **`/admin`** (nuevo): resumen de la plataforma — conteos (conductores, talleres,
  solicitudes, citas, reseñas) + últimos 10 de cada tabla. `features/admin/data.ts`.
- **`/admin/cuenta`**: datos reales del perfil admin (antes era mock).
- **Guard `requireAdmin()`** en el DAL: sin rol admin redirige a `/`.
- Login de admin redirige a `/admin`; "Mi cuenta" del header también.
- Nav admin limpiado (solo Resumen + Mi cuenta; se quitaron links muertos).

---

## ✅ Fase 8 — Post-entrega (sesión 2026-08-14 tarde/noche)

### Ubicación real (diseño i46XY + Location Bar de LBTH5)
- **Modal "Cambiar ubicación"**: mapa Leaflet/OpenStreetMap real con pin arrastrable,
  círculo de radio, botones **+/− que amplían/reducen el radio** (2→5→10→20→30→40→50→Todos)
  sincronizados con el select, y el mapa se reencuadra solo. Deps: `leaflet` + `react-leaflet`.
- **Geolocalización al entrar a `/talleres`**: pide permiso; si lo dan, ordena por cercanía
  automática (chip "Cerca de ti"); si no, campo "O escribe tu dirección" con geocodificación
  **Nominatim/OSM** (gratuita, sesgada a MX) en el modal.
- **Location Bar** en el marketplace: "Elegir ubicación" + orden (Cercanía/Calificación/Reseñas);
  distancias y ETA **reales** (haversine en `features/talleres/geo.ts`).
- **Buscador del hero** funcional (`/talleres?q=`); campo "Ubicación" del hero eliminado.
- **Ubicación del taller en `/panel/cuenta`**: sección "Ubicación en el mapa" con pin,
  "Usar mi ubicación" y guardar lat/lng (`actualizarTaller`). Aviso si el taller no tiene
  coordenadas (no aparece en búsquedas por cercanía hasta colocar el pin).

### Rol admin completo
- Migración `0004_admin.sql` (rol, `is_admin()`, policies de lectura total) — **ejecutada**.
- `motoresenmarcha2026@gmail.com` es admin (avatar = logo). Panel `/admin` con resumen
  de toda la plataforma; `/admin/cuenta` real; guard `requireAdmin`.
- **Botón "Eliminar datos de demostración"** (migración `0005_limpiar_demo.sql` — ejecutada):
  confirma en 2 pasos y borra los talleres del seed + sus reseñas/citas/solicitudes.
  Los datos reales no se tocan. **Usarlo cuando arranquen en serio.**

### Calidad / pulido
- **Imágenes del seed** reemplazadas por fotos automotrices de Unsplash acordes a cada
  especialidad (adiós perro 🐕) + avatares de iniciales (script `scripts/update-seed-images.mjs`).
- **Revisión responsive** (iPad 768 y celular 390) con la skill impecable: 12 defectos
  corregidos (nav del dashboard scrolleable con ítem activo visible, header con hamburguesa
  hasta `lg`, tabla de horarios, controles duplicados, textos cortados, hit-areas táctiles).
- **Editar Mi Cuenta guarda de verdad** (`actualizarPerfil` → `profiles`); email/rol solo lectura.
- Botón muerto "Comparar" del perfil → reemplazado por **"Agendar cita"** (ruta antes inalcanzable).
- **36+ tests E2E** (público, conductor, taller, admin, ubicación, responsive del panel).

### Infra nueva
- **CI GitHub Actions** (`.github/workflows/ci.yml`): lint + typecheck + build en cada
  push/PR. Los E2E NO corren en CI (escriben en la DB real) — correr local antes de push.
- **SEO**: `robots.ts` (bloquea admin/panel/cuenta/citas), `sitemap.xml` (estáticas + un
  URL por taller), `metadataBase`, y `generateMetadata` por taller (título/desc/OG image).
- **Vercel Analytics**: `<Analytics/>` instalado en el layout.

---

## 🔜 Pendientes que requieren acción humana

| Quién | Pendiente |
|---|---|
| **Edgar (1 clic)** | **Activar Web Analytics** en Vercel: dashboard → proyecto → Analytics → Enable (sin esto el script instalado no recolecta) |
| Edgar | Commit + push de la Fase 8 (CI/SEO/analytics/ubicación taller) |
| Admin | Usar el botón **"Eliminar datos de demostración"** en `/admin` cuando arranquen en serio |
| Cliente | Contenido de **"Sobre nosotros"** (la página se agrega en minutos cuando exista el texto) |
| Cliente | **Revisión de los textos legales por un abogado** antes de operar formalmente |
| Decisión | **Confirmación de email** al registrarse (hoy OFF): Supabase → Auth → "Confirm email" |
| Futuro | **Pagos** (Stripe/Conekta) si monetizan — feature nueva completa |
| Futuro | **Horarios de cita reales por taller** (hoy franjas fijas 09:00–17:30, sin anti-doble-reserva) |

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
- **Tests E2E en puerto 3100** (`npm run test:e2e`): el 3000 suele estar ocupado por otro
  proyecto local. Después de correr tests, ejecutar el SQL de limpieza de `e2e/README.md`.
- **CLI de Vercel local autenticada en otra cuenta** — para operaciones del proyecto Vercel
  usar el dashboard web con la sesión del navegador.
- **`talleres.owner_id` NO cascadea** al borrar el usuario: borrar primero la fila de
  `talleres` y después el `auth.users` (así lo hace el SQL de limpieza).

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
