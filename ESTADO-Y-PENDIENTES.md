# Motores en Marcha — Estado y pendientes

> Marketplace web que conecta conductores con mecánicos/talleres, con flujo de
> ayuda de emergencia (SOS/WhatsApp). Stack: **Next.js 16 (App Router) · React 19 ·
> TypeScript · Tailwind v4 · Supabase**. Arquitectura **feature-based** en `src/features/*`.
>
> Última actualización: sesión del 2026-09-18.
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

## ✅ Fase 9 — Rol vendedor + marketplace de refacciones (sesión 2026-09-02)

Nuevo **cuarto rol `vendedor`** para vender refacciones (autopartes). Modelo
**tienda + productos**, contacto por **WhatsApp** (sin pagos/carrito), **sin reseñas**
por ahora. Todo replica el patrón de `talleres`.

- **Migración `0006_vendedores_refacciones.sql`** (⚠️ **correr en Supabase SQL Editor**):
  constraint de rol con los 4 roles; tablas `vendedores` (tienda, 1 por owner) y
  `refacciones` (productos, FK `vendedor_id`, slug único por vendedor); RLS
  (lectura pública, dueño vía subquery, admin); `handle_new_user()` extendido para
  crear la tienda al registrarse con `rol='vendedor'`; bucket Storage `refacciones`
  (carpeta = `auth.uid()`).
- **Auth/registro:** `requireVendedor()` en el DAL; `registrarVendedor` + rama
  `vendedor` en `completarPerfil`; `/registro/vendedor` + `FormRegistroVendedor`;
  tarjeta en `SelectorTipoUsuario` (grid 3) y opción en `OnboardingForm`;
  redirect por rol (login/callback → `/vendedor/refacciones`); `ConfirmacionContenido`.
- **Panel del vendedor** (`/vendedor/*`, protegido por proxy): `/vendedor/refacciones`
  con **CRUD de inventario** (`InventarioRefacciones`: alta/edición/baja + subida de
  foto al bucket) y `/vendedor/cuenta` (`FormCuentaVendedor`, sin mapa). `NAV_VENDEDOR`
  + `vendedorShell`.
- **Marketplace público** `/refacciones` (`RefaccionesCliente`: filtros por categoría,
  texto y orden por precio — sin geolocalización), `TarjetaRefaccion`, detalle
  `/refacciones/[id]` (`PerfilRefaccion` + metadata/OG), y sección **Refacciones
  destacadas** en la Home. Link "Refacciones" en el Header.
- **Admin:** conteos de vendedores/refacciones + paneles "Vendedores" y "Últimas
  refacciones" en `/admin`.
- **SEO:** `/refacciones` en sitemap (+ una URL por producto); `/vendedor` en
  robots disallow. `next.config` sin cambios (mismo host de Supabase Storage).
- **Verificado:** `tsc --noEmit`, `eslint` y `next build` en verde.
- ✅ **Migración `0006` corrida en Supabase** (2026-09-18). El bucket `refacciones`
  y el flujo de vendedor ya no dependen de un pendiente humano.

## ✅ Fase 10 — Rediseño visual completo con la skill Impeccable (sesión 2026-09-07)

Se **reemplazó el mundo visual** del sitio. Decisión del cliente: solo lo visual —
producto, copy factual, categorías, rutas y funciones no cambian.

**El mundo:** tren de agitación constructivista (seed `6c8762a5`). Elegido por Edgar
sobre la dirección que asignaron los dados y sobre la salida estándar de la categoría.
Papel periódico crema · negro hollín · rojo racionado a la cuña que empuja la acción ·
verde solo en controles rotulados WhatsApp. Esquinas vivas en todo el sitio, cero
sombras, superficies del navegador tematizadas.

### Sistema
- **`src/app/globals.css` reescrito.** Los NOMBRES de los tokens se conservaron a
  propósito (`action-primary`, `surface-page`, …) para que reasignar valores propague
  el mundo a las ~35 superficies sin tocarlas. Radios todos en `0px`. Se añadieron
  utilidades de material: `.plancha-foto` + `.plancha-foto-trama` (trama de medios
  tonos real por `color-burn`), `.cuna` / `.filo-cuna`, `.banderin`,
  `.filete-banderin`, `.sangra-izq`, `.grano-papel`, `.locomotora`.
- **De 4 familias tipográficas a 2**: Big Shoulders (versales de plantilla) sobre
  Archivo (texto y datos, con cifras tabulares en todo lo que se mide).
- **Movimiento**: un solo momento orquestado — `RielDeAvance`, la cuña roja que
  recorre el viewport ligada al scroll. Va por rAF sobre variable CSS y **no** por
  `animation-timeline: scroll()`, que no existe en Safari.

### Superficies rehechas
Portada · `/talleres` · `/talleres/[id]` · `/refacciones` · `/refacciones/[id]` ·
`/solicitar` · agendar cita · calificar · reseñas · modal de ubicación · mapa ·
`/login` · los tres registros · onboarding · confirmación.

Composiciones nuevas que `DESIGN.md` canoniza para reusar: la **secuencia de paradas**
(plancha líder + renglones reglados sobre el riel, que reemplazó una rejilla de tres
tarjetas iguales), el **manifiesto reglado**, la **plancha de taller** con fotografía
tramada y banda de medición, y el **estado vacío declarado**.

### Proceso
Dos rondas de revisión independiente por agente en contexto limpio. Primer veredicto
`rebuild`, segundo `fix` con 7 de 8 arreglos resueltos y el octavo **retirado por el
propio revisor** tras remedir los píxeles. El documenter escribió `DESIGN.md` desde lo
construido y **se negó a canonizar dos defectos** (la sombra dura del sello SOS y el
`inputBaseClass` con halo suave); ambos se corrigieron.

### Correcciones de datos y contenido
- Se **retiró la cifra "+500 mecánicos verificados"** del hero: Edgar confirmó que no
  es cierta todavía. Queda registrado en `PRODUCT.md` para que no se reintroduzca.
- Se cerró el camino a la foto de stock: `talleres/mock.ts` ya no devuelve
  `picsum.photos` y `images.unsplash.com` salió de `next.config.ts`.
- Imagen de OpenGraph dedicada `public/og.jpg` (1538 KB → 212 KB). Nota: `logo.png`
  **no** costaba 1.5 MB en carga — `next/image` ya lo redimensiona a 3.6 KB; el peso
  solo afectaba a los rastreadores de redes.

### Verificado
24 vistas (escritorio y celular): contraste 0 fallos, áreas táctiles bajo 44px 0,
radios ≠0 → 0, sombras 0, sin desbordamiento horizontal. `impeccable detect` exit 0.
`tsc`, `eslint`, `next build` en verde. **`e2e/publico.spec.ts` 15/15 sin modificar
ningún test** (se arregló el código, no las pruebas).

### Artefactos nuevos
`PRODUCT.md` · `DESIGN.md` · `.impeccable/design.json` ·
`.impeccable/surfaces/src-app-page-tsx.md` (contrato de dirección con el seed).

### Lo que NO entró
**Fase 3 — paneles y roles**: `DashboardShell` y los paneles de taller, vendedor y
admin heredaron tokens, tipografías e inputs, pero su composición sigue siendo la del
mundo anterior (13 archivos). Ver `PENDIENTES-MANANA.md`.

---

## ✅ Fase 11 — Tono de fondo más claro (sesión 2026-09-18)

Edgar reportó que el papel crema del rediseño (Fase 10) se leía amarillo. Se
bajó saturación y se subió luminosidad manteniendo el concepto "papel
periódico" y el resto del mundo (tinta negra, rojo racionado, cero sombras)
sin tocar.

- `--color-surface-page`: `#ecddbc` → `#f1ede2`.
- `--color-surface-card`: `#f4e9cf` → `#faf7ef`.
- `--color-border-subtle`: `#c4b79e` → `#cec7b6` (mismo nivel de sutileza
  contra el fondo: 1.44:1 vs 1.47:1 antes).
- Color hardcodeado `PAPEL` en `MapaUbicacion.tsx` (relleno del pin del mapa)
  actualizado a juego.
- Contraste de texto y acentos (foreground-secondary, emergency, whatsapp,
  status) **mejoró en todos los casos** al aclarar el fondo — verificado por
  cálculo WCAG, no solo a ojo.
- Verificado: `tsc --noEmit` en verde, revisión visual en `/` y `/solicitar`
  con el dev server (puerto 3200).
- **Migración `0006` corrida en Supabase** el mismo día — desbloquea
  `/refacciones` y `/vendedor/*`.
- **Sin commitear** al cierre de la sesión.

## ✅ Fase 12 — Rediseño visual, Fase 3: paneles y roles (sesión 2026-09-18 tarde)

Se cerró la única parte del rediseño de la Fase 10 que faltaba: la composición
de los paneles de los 4 roles (heredaban tokens/tipografía/esquinas pero no la
composición del mundo nuevo). 13 archivos, con `/impeccable onboard`:

- **`DashboardShell.tsx`** (chasis compartido): plancha con barra de título en
  tinta, avatar cuadrado, sello de perfil en tinta sólida, renglones de nav
  reglados con plancha sólida (no tinte) en el activo.
- **`admin/page.tsx`**: los 7 stat tiles (*hero-metric template*, rechazado por
  el piso de calidad de Impeccable) → manifiesto reglado de conteos; `Panel`,
  `Chip` y `Vacio` migrados al mismo patrón de plancha + barra de título.
- Los 13 archivos: esquinas cuadradas, planchas de 2px, sellos de estado en
  tinta sólida (no tintes al 15%), mayúsculas en títulos `font-heading`,
  franjas de error/éxito con marco de 2px. Los bloques "aún no tienes
  taller/negocio registrado" ahora usan `EstadoVacio` en vez de markup manual.
- Los 4 "callejones sin salida" que `PENDIENTES-MANANA.md` reportaba como
  pendientes **ya estaban resueltos** desde `f7826fc` — el documento estaba
  desactualizado.
- **Revisión independiente** (agente en contexto limpio) encontró y corrigió un
  hallazgo real: el estado activo del sidebar reintroducía el tinte al 15%
  que se había quitado en el resto del diff, aplicado sin acotar a un
  breakpoint (la excepción de `DESIGN.md` es solo para el menú móvil del
  Header). También corrigió `EstadoVacio.tsx` (le faltaba `uppercase`).
- **Verificado:** `tsc --noEmit`, `eslint`, `next build` en verde; detector
  mecánico de Impeccable en 0 hallazgos. **No probado con sesión autenticada
  en navegador** (evita escribir datos de prueba en el Supabase real).
- **Sin commitear** al cierre de esta sesión.

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
- **Los tokens son la palanca (fase 10)**: los nombres son semánticos
  (`bg-action-primary`, `text-foreground-secondary`), así que reasignar valores en
  `globals.css` propaga el mundo a todo el sitio. **No renombrar los tokens.**
- **`rounded-full` es el único radio que los tokens NO alcanzan.** Todos los
  `--radius-*` están en `0px`, así que `rounded-lg/xl/2xl` ya salen cuadrados solos;
  `rounded-full` hay que cambiarlo a mano.
- **`inputBaseClass`** (en `components/ui/FormField.tsx`) alcanza 6 archivos:
  editarlo propaga a todos los formularios. Misma palanca que los tokens.
- **`.filete-banderin`** pinta el borde con el fondo (`border-box` tinta,
  `padding-box` papel) porque una sombra interior la corta el `clip-path` del
  banderín y el filete queda abierto por la derecha. No sustituir por `box-shadow`.
- **`--sos-invade`** mide cuánto invade el sello SOS el contenido, **contra el
  viewport y no contra el contenedor**: a 1280px el `max-w-7xl` toca el borde y el
  sello entra 240px. El sello está siempre visible por decisión del cliente; son los
  controles los que lo esquivan.
- **El copy del producto no cambia con el rediseño.** Los tests E2E dependen de
  textos exactos ("talleres encontrados", "Disponibilidad", "Cerca de ti · todos los
  talleres"). Ya se rompieron una vez por renombrarlos.
- **El puerto 3000 lo suele tomar otro proyecto** (XALAPA/PLAN, Trevana). Levantar
  con `npx next dev -p 3200` y **verificar la identidad del sitio antes de medir o
  capturar**: en la sesión del 2026-09-07 se midió el sitio equivocado una vez.
- **Playwright no arranca si hay un `next dev` del mismo proyecto arriba**: Next 16
  rechaza un segundo dev server. Bajar el 3200 antes de correr los E2E.
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
cd ~/Desktop/Daniel/NewProjects/MecaWeb
npx next dev -p 3200   # el 3000 suele estar ocupado por otro proyecto
                       # http://localhost:3200 (usa .env.local → Supabase)
```

Lo pendiente inmediato vive en **`PENDIENTES-MANANA.md`**.
