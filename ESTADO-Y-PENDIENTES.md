# Motores en Marcha — Estado y pendientes

> Marketplace web que conecta conductores con mecánicos/talleres, con flujo de
> ayuda de emergencia (SOS/WhatsApp). Stack: **Next.js 16 (App Router) · React 19 ·
> TypeScript · Tailwind v4 · Supabase**. Arquitectura **feature-based** en `src/features/*`.
>
> Última actualización: sesión del 2026-08-12.

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
- **Vercel**: proyecto `motoresenmarcha-web` → https://motoresenmarcha-web.vercel.app
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
- ⚠️ **Falta para que Google funcione:** crear el OAuth Client en Google Cloud y pegar
  Client ID + Secret en Supabase → Auth → Providers → Google (pasos al final de esta sección).
- 🧹 **Datos de prueba** creados en local (borrar cuando quieras): usuarios
  `ana.conductora@mecaweb.mx`, `taller.rapido@mecaweb.mx` + su taller "Taller El Rápido Prueba".
- Nota menor: el `slugify` SQL no quita acentos (`Rápido`→`r-pido`); cosmético, el slug es único.

### 🔧 Pasos para activar Google OAuth (pendiente — requiere tu cuenta de Google Cloud)
1. **Google Cloud Console** → APIs & Services → Credentials → *Create OAuth client ID* → **Web**.
   - Authorized redirect URI: `https://ygxxsgypnoflqbwrrlxq.supabase.co/auth/v1/callback`
   - (Si pide configurar la *OAuth consent screen* primero: tipo **External**, nombre de la app,
     tu correo de soporte, y añádete como *test user*.)
2. Copia **Client ID** y **Client Secret**.
3. **Supabase** → Auth → Providers → **Google**: activar, pegar Client ID + Secret, **Save**.
4. Probar en `http://localhost:3000/login` → "Continuar con Google" → debe caer en `/onboarding`
   (elegir conductor/taller) la primera vez. Redirect URLs ya están configuradas.

## 🔜 Pendientes (EN ORDEN — empezar por el 1)

### 1. Escritura de datos (INSERT) ✍️
- **Solicitar servicio** (`/solicitar`) → insertar en `solicitudes` antes de abrir WhatsApp.
- **Agendar cita** (`/citas/agendar/[tallerId]`) → insertar en `citas`.
- **Calificar** (`/calificar/[servicioId]`) → insertar en `resenas` (ya hay policy `resenas_insert_own`).
- Todos requieren usuario autenticado (ya hay Auth). Buscar los `// TODO: conectar a Supabase`.
- Usar `requirePerfil()` del DAL para obtener el usuario/rol en las server actions.

### 2. Panel del taller con datos reales
- Hoy `/panel/solicitudes` y `/panel/cuenta` usan mock.
- La **policy RLS ya existe** (`solicitudes_taller_read` en `0002_auth.sql`): el taller ve las
  solicitudes de los talleres que posee (`owner_id`). Solo falta conectar el panel a datos reales.
- Ligar el panel al taller del usuario: `select * from talleres where owner_id = auth.uid()`.

### 3. Realtime ⚡
- Canal de Supabase Realtime para que el panel del taller reciba **solicitudes nuevas al instante**.
- Opcional: estado de citas en vivo para el conductor.

### 4. Limpieza y mejoras (cuando el core esté listo)
- **Quitar el fallback a mock** en `data.ts` cuando la BD sea la única fuente.
- **Imágenes reales** → Supabase Storage (hoy se usan placeholders de `picsum.photos`).
- Migrar las demás features (citas/solicitudes/usuarios) a capas `data.ts` como se hizo con talleres.
- **Borrar el proyecto Vercel duplicado** `motoresenmarcha-web-ay37` (el bueno es `motoresenmarcha-web`).
- Variantes móviles del diseño (hoy todo es responsive con un solo componente; el `.pen`
  tiene componentes Header Mobile / SOS FAB Mobile si se quisiera fidelidad extra).
- Tests + CI.

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
- **Patrón data layer**: cada `data.ts` intenta Supabase y cae a mock si falla → la app nunca se rompe.
- **Fuente de la verdad del diseño**: archivo Pencil `~/Desktop/meca2.pen` (usar MCP `pencil`).

---

## 🔑 Referencias rápidas

| Recurso | Valor |
|---|---|
| Repo GitHub | `motoresenmarcha2026-hub/motoresenmarchaWeb` (rama `main`) |
| Remote SSH | `git@github-motoresenmarcha:motoresenmarcha2026-hub/motoresenmarchaWeb.git` |
| Producción | https://motoresenmarcha-web.vercel.app |
| Proyecto Vercel | `motores-en-marcha/motoresenmarcha-web` (ignorar duplicado `-ay37`) |
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
npm install          # por si acaso
npm run dev          # http://localhost:3000 (usa .env.local → Supabase)
```

Empezar por el **pendiente #1 (Auth)**. Buscar en el código los marcadores:

```bash
grep -rn "TODO: conectar a Supabase" src/
```
