# Pendientes para retomar — rediseño visual (fases 1, 2 y 3 hechas)

> Escrito el 2026-09-07 al cierre de la sesión. Actualizado 2026-09-18.
> **El trabajo está commiteado y pusheado** (`f7826fc`, 141 archivos, +26,288 líneas)
> y **ya está vivo en producción**: `https://www.motoresenmarcha.com` sirve el mundo
> nuevo (verificado: el eyebrow y la cifra "+500 mecánicos" ya no existen ahí).

## ✅ 2026-09-18 (tarde) — Fase 3: paneles y roles

Se rehizo la composición de los 13 archivos pendientes de la Fase 3 (paneles de
taller/vendedor/admin), la única parte del rediseño visual que faltaba.

- **`DashboardShell.tsx`** (chasis de los 4 roles): plancha con barra de título
  en tinta, avatar cuadrado con marco de 2px, sello de perfil en tinta sólida
  (`badgeTono()` mapea Disponible/Ocupado/Verificado/rol), renglones de
  navegación reglados con plancha sólida (no tinte) en el renglón activo.
- **`admin/page.tsx`**: los 7 stat-tiles (el *hero-metric template* que el piso
  de calidad de Impeccable rechaza por nombre — número grande + etiqueta chica
  + acento) → reemplazados por un **manifiesto reglado de conteos** (plancha +
  barra de título + renglones). `Panel`/`Chip`/`Vacio` migrados al mismo patrón
  de plancha con barra de título y sellos en tinta sólida.
- **Los 13 archivos**: esquinas cuadradas (`rounded-2xl/xl/lg/full` →
  `rounded-none` o eliminado), planchas con borde de 2px en vez de
  `border border-border-subtle`, sellos de estado en **tinta sólida** en vez
  de tintes al 15% (`TarjetaSolicitud`, `PanelSolicitudes`,
  `InventarioRefacciones`), mayúsculas en todos los títulos `font-heading`
  (regla de versales del mundo), franjas de error/éxito con marco de 2px en
  vez de fondo con tinte (mismo patrón que ya tenía `FormCuentaVendedor.tsx`).
  Los 4 bloques "aún no tienes taller/negocio registrado" ahora usan el
  componente `EstadoVacio` en vez de markup manual duplicado.
- **Los 4 "callejones sin salida"** (`panel/sucursales`, `panel/notificaciones`,
  `cuenta/vehiculo`, `cuenta/notificaciones`) **ya estaban resueltos** desde el
  commit `f7826fc` con `EstadoVacio` — este documento estaba desactualizado en
  ese punto, no era un pendiente real.
- **Revisión independiente** (agente en contexto limpio, solo lectura) encontró
  un hallazgo real: el estado activo del sidebar reintroducía el tinte al 15%
  que ya se había quitado en otros 3 archivos del mismo diff, aplicando a todos
  los breakpoints la excepción del renglón activo móvil del Header (que en
  `Header.tsx` está acotada a `lg:hidden`). Corregido a plancha sólida
  (`bg-action-primary text-foreground-inverse`) en todos los tamaños. También
  se corrigió `EstadoVacio.tsx` (le faltaba `uppercase` en el título — bug
  preexistente que ahora hereda más superficies por este cambio) y dos usos de
  `hover:bg-black/5` (token crudo) → `hover:bg-surface-page`.
- **Verificado:** `tsc --noEmit`, `eslint` y `next build` en verde; detector
  mecánico de Impeccable (`impeccable detect`) en 0 hallazgos tras las
  correcciones. **No se probó con sesión autenticada en navegador** (los
  paneles requieren login; hacerlo habría escrito usuarios/datos de prueba en
  el Supabase real). **Sin commitear todavía.**

## ✅ 2026-09-18 (mañana) — hecho hoy

- **Migración `0006` corrida en Supabase.** Ya no es bloqueante: `/refacciones`
  y `/vendedor/*` pueden dejar el estado vacío.
- **Tono de fondo ajustado.** El crema original (`#ecddbc`/`#f4e9cf`) se leía
  amarillo — Edgar pidió cambiarlo. Ahora es hueso claro neutro:
  `--color-surface-page: #f1ede2`, `--color-surface-card: #faf7ef`,
  `--color-border-subtle: #cec7b6` (mismo nivel de sutileza que antes, 1.44:1
  vs 1.47:1). Contraste de texto/acentos contra el fondo **mejoró en todos los
  casos** (nunca empeoró) al aclarar. Un solo lugar: `src/app/globals.css`.
  También se actualizó el color hardcodeado del pin del mapa en
  `MapaUbicacion.tsx` (`PAPEL`) para que combine. Verificado con `tsc --noEmit`
  y visualmente en `/` y `/solicitar` con el dev server. **Sin commitear
  todavía** — revisar el diff antes del próximo commit.

---

## ⛳ Dónde quedamos

Se reemplazó el mundo visual del sitio con la skill **Impeccable**. El mundo elegido
—por ti, sobre la asignación de los dados y sobre la salida estándar— es el
**tren de agitación constructivista** (seed `6c8762a5`): papel periódico crema, negro
hollín, rojo racionado a la cuña que empuja la acción, verde solo donde se cierra el
contacto por WhatsApp. Esquinas vivas en todo el sitio, cero sombras.

**Hecho y verificado:**

- **Fase 1 — portada.** Dos rondas de revisión independiente (`rebuild` → `fix` →
  7 de 8 arreglos resueltos, el octavo retirado por el revisor tras remedir).
- **Fase 2 — catálogos y flujo.** `/talleres`, `/talleres/[id]`, `/refacciones`,
  `/refacciones/[id]`, `/solicitar`, agendar cita, calificar, reseñas, modal de
  ubicación, mapa Leaflet.
- **Auth completo.** `/login`, los tres registros, onboarding, confirmación.
- **Documentación.** `PRODUCT.md` y `DESIGN.md` (+ `.impeccable/design.json`).

**Medido al cierre — 24 vistas, escritorio y celular:** contraste 0 fallos reales,
áreas táctiles bajo 44px 0, radios distintos de 0 → 0, sombras 0, sin desbordamiento
horizontal, `impeccable detect` en exit 0, `tsc` · `eslint` · `next build` en verde.

---

## 🚧 Lo que falta (en orden)

### 1. ✅ Fase 3 — paneles y roles (hecho, sesión 2026-09-18 tarde)
Ver la entrada de arriba. Los 13 archivos, los 4 callejones (ya estaban resueltos)
y los stat tiles de `admin` quedaron resueltos y verificados. **Sin commitear.**

### 2. Correr los E2E que faltan
Solo se corrió **`e2e/publico.spec.ts` → 15/15 en verde**, sin modificar ningún test.

**NO se corrieron** `conductor.spec.ts`, `taller.spec.ts` ni `admin.spec.ts` porque
**crean usuarios en la Supabase real**. Correrlos y después ejecutar el SQL de
limpieza de `e2e/README.md`.

⚠️ Playwright levanta su propio servidor en 3100 y Next 16 **no permite dos dev
servers del mismo proyecto**: hay que bajar cualquier `next dev` antes de correrlos.

### 3. Datos basura visibles en producción
En `/talleres` hay un taller real llamado **LOPEX** con 0 reseñas, sin coordenadas
(por eso no muestra distancia ni ETA) y cuya foto **es la captura de un documento de
texto** ("I'm John Smith…"). El diseño ya lo protege —la plancha principal exige
tener foto y calificación, así que LOPEX cae a renglón— pero el registro sigue ahí y
se ve. Decidir si se borra o se le pide al dueño que lo complete.

### 4. Limpieza de repo
Se commitearon **8.8 MB de capturas** en `.impeccable/review/` (42 PNG). Son
evidencia de las revisiones, no código. Considerar añadir a `.gitignore`:

```gitignore
.impeccable/review/
```
(`PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json` y `.impeccable/surfaces/`
**sí** deben quedarse: son el sistema de diseño y lo que gobierna las fases futuras.)

---

## ⚠️ Trampas nuevas — no re-romper

- **El copy NO cambia.** Fue una decisión explícita tuya: el rediseño es solo visual.
  Ya se violó una vez durante la sesión (se renombró "talleres encontrados",
  "Disponibilidad", etc.) y **se revirtió todo**. Los tests E2E dependen de esos
  textos exactos.
- **Los tokens son la palanca.** `src/app/globals.css` usa nombres semánticos
  (`bg-action-primary`, `text-foreground-secondary`). Reasignar valores ahí propaga
  el mundo a todo el sitio sin tocar componentes. **No hay `tailwind.config.ts`.**
- **`rounded-full` es el único radio que los tokens NO alcanzan.** Todos los
  `--radius-*` están en `0px`, así que cualquier `rounded-lg`/`xl`/`2xl` ya sale
  cuadrado solo; `rounded-full` hay que cambiarlo a mano.
- **`inputBaseClass` (en `FormField.tsx`) alcanza 6 archivos.** Editarlo una vez
  propaga a todos los formularios del sitio. Misma palanca que los tokens.
- **`.filete-banderin`** pinta el borde con el fondo (`border-box` tinta,
  `padding-box` papel) porque una sombra interior la corta el `clip-path` del
  banderín y el filete queda abierto por la derecha. No sustituir por `box-shadow`.
- **`--sos-invade`** calcula cuánto invade el sello SOS el contenido, medido contra
  el **viewport**, no contra el contenedor: a 1280px el `max-w-7xl` toca el borde y
  el sello se mete 240px dentro. Los controles de renglón lo esquivan con eso. El
  sello **siempre está visible** (decisión tuya) y no debe volver a ocultarse solo.
- **El puerto 3000 lo tiene otro proyecto tuyo** (XALAPA/PLAN); también corre
  Trevana. Durante la sesión se capturó el sitio equivocado una vez por esto. Usar
  `npx next dev -p 3200` y **verificar identidad antes de medir**.

---

## 🔮 Techo no alcanzado (opcional, lo dijo el revisor)

Ninguno bloquea el envío. Si se financia otra ronda, el propio revisor señaló que el
de mayor rendimiento y más barato es el primero:

1. **Sobreimpresión y desregistro** — la firma más reconocible de este mundo, sobre
   un build que ya imprime el rojo como segunda pasada.
2. Filetes de grosor graduado (hoy todo es 2px uniforme).
3. Tipografía cruzando la fotografía (hoy titular y plancha viven en cajas vecinas).

---

## 📌 No es un defecto — no lo "arregles"

- Mi instrumento de medición reporta **"Ver talleres" en 1.25:1** en la portada. Es
  un falso positivo: el script recorre la cadena de fondos CSS y no ve la cuña roja
  superpuesta. El valor real es **~6:1**, verificado a mano y confirmado por el
  revisor independiente, que **retiró** su propio hallazgo tras remedir los píxeles.
- El sello SOS se solapa transitoriamente con enlaces del footer a media página. Con
  un botón siempre visible eso es geometría inevitable; **en reposo (scroll al
  fondo) no tapa nada**, verificado en 5 anchos. El botón de WhatsApp —la acción
  primaria— queda entre 0% y 21% tapado según el ancho.
- `BadgeEta` quedó como export sin usar tras rehacer las tarjetas. Se dejó a
  propósito para la Fase 3 en vez de churn.
- `picsum.photos` sigue en `next.config.ts` solo para **avatares** de mock. La foto
  de stock ya no puede reaparecer: `talleres/mock.ts` devuelve `""` y la UI dibuja
  la plancha de tinta. `images.unsplash.com` se retiró por completo.

---

## 🔑 Artefactos del sistema de diseño

| Archivo | Qué es |
|---|---|
| `PRODUCT.md` | Verdad del producto: usuarios, propósito, restricciones, evidencia. **Registra que no existe cifra de mecánicos verificados — no inventarla.** |
| `DESIGN.md` | El sistema visual, escrito desde lo construido. Gobierna la Fase 3. |
| `.impeccable/design.json` | Sidecar del anterior. |
| `.impeccable/surfaces/src-app-page-tsx.md` | Contrato de dirección de la portada, con el seed `6c8762a5`. |

Para retomar con la skill: `/impeccable` (menú) o directo, p. ej.
`/impeccable onboard src/app/panel` para los 4 callejones vacíos.

---

## 🔜 Pendientes heredados que siguen abiertos

| Quién | Pendiente |
|---|---|
| **Edgar (1 clic)** | Activar **Web Analytics** en Vercel (sin esto el script no recolecta) |
| Admin | Botón "Eliminar datos de demostración" en `/admin` cuando arranquen en serio |
| Cliente | Contenido de **"Sobre nosotros"** |
| Cliente | **Revisión de los textos legales por un abogado** |
| Decisión | **Confirmación de email** al registrarse (hoy OFF) |
| Futuro | Pagos (Stripe/Conekta) · horarios reales por taller (hoy 09:00–17:30 fijos, sin anti-doble-reserva) |
