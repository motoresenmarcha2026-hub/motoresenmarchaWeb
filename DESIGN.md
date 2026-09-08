---
name: Motores en Marcha
description: Newsprint-and-ink agit-train: soot black on cream stock, red rationed to the wedge that pushes the action.
colors:
  action-primary: "#171410"
  action-primary-dark: "#000000"
  action-urgent: "#9e1a14"
  action-urgent-dark: "#7a130e"
  emergency: "#c8241c"
  emergency-dark: "#9e1a14"
  emergency-plancha: "#ef5a41"
  whatsapp: "#125c31"
  whatsapp-dark: "#0b3d20"
  status-available: "#17703c"
  status-busy: "#5c554a"
  accent-primary: "#8a8378"
  foreground-primary: "#171410"
  foreground-secondary: "#5c554a"
  foreground-inverse: "#fbf6ea"
  foreground-inverse-secondary: "#b5aa94"
  surface-page: "#ecddbc"
  surface-card: "#f4e9cf"
  surface-inverse: "#171410"
  border-primary: "#171410"
  border-subtle: "#c4b79e"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3rem, 10.5vw, 6.75rem)"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Big Shoulders, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.01em"
  title:
    fontFamily: "Big Shoulders, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.01em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Big Shoulders, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.14em"
  data:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    fontFeature: "'tnum' 1"
rounded:
  xs: "0px"
  sm: "0px"
  md: "0px"
  lg: "0px"
  xl: "0px"
  2xl: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.action-primary}"
    textColor: "{colors.foreground-inverse}"
    rounded: "{rounded.md}"
    padding: "0 32px 0 24px"
    height: "48px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.action-primary-dark}"
  button-emergency:
    backgroundColor: "{colors.emergency}"
    textColor: "{colors.foreground-inverse}"
    rounded: "{rounded.md}"
    padding: "0 32px 0 24px"
    height: "48px"
  button-emergency-hover:
    backgroundColor: "{colors.emergency-dark}"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.foreground-inverse}"
    rounded: "{rounded.md}"
    padding: "0 24px 0 16px"
    height: "44px"
  button-whatsapp-hover:
    backgroundColor: "{colors.whatsapp-dark}"
  button-outline:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.foreground-primary}"
    rounded: "{rounded.md}"
    padding: "0 24px 0 16px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.border-primary}"
    textColor: "{colors.foreground-inverse}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground-primary}"
    padding: "0 32px 0 24px"
    height: "48px"
  button-ghost-hover:
    textColor: "{colors.emergency}"
  card-plancha:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.foreground-primary}"
    rounded: "{rounded.md}"
    padding: "16px"
  panel-titlebar:
    backgroundColor: "{colors.surface-inverse}"
    textColor: "{colors.foreground-inverse}"
    typography: "{typography.label}"
    padding: "6px 16px"
  input-search:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.foreground-primary}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 16px"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.foreground-primary}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
  badge-available:
    backgroundColor: "{colors.status-available}"
    textColor: "{colors.foreground-inverse}"
    rounded: "{rounded.md}"
    padding: "4px 8px"
  badge-busy:
    backgroundColor: "{colors.status-busy}"
    textColor: "{colors.foreground-inverse}"
    rounded: "{rounded.md}"
    padding: "4px 8px"
---

# Design System: Motores en Marcha

## Overview

**Creative North Star: "The Agitation Train"**

The site is a train that carries a stranded driver's problem to whoever can fix it: every section is a car, every workshop is a stop. That metaphor is not decoration on top of a neutral UI — it is the printing method. The world prints in three inks on newsprint: soot black on cream stock, red rationed to the diagonal wedge that pushes the action, and a channel green that appears only where contact actually closes. Photography arrives as a real halftone plate, not a tinted image. Rules of black ink separate things, never shadows, never gray cards floating on gray.

The system's central mechanism is that **components never name a color; they name a job.** Every surface in the codebase writes `bg-action-primary`, `text-foreground-secondary`, `border-border-subtle`. Raw hex values in components are effectively absent. The world lives in one `@theme` block in `src/app/globals.css`, so reassigning a token there propagates the world to every surface without editing those files. The zero-radius scale is the same lever pulled a second time: setting every `--radius-*` to `0px` squares every pre-existing `rounded-lg` in the codebase at once. Future work inherits the world by using the semantic names, not by copying values.

Density is high and confident. Type is condensed stencil caps stacked tight; measurement is tabular and never abbreviated away on small screens, because the confirmed primary scene is one hand on a phone at the roadside. Confirmed rejections: no split hero with stock photography, and no grid of three identical cards where a hierarchy of stops belongs.

**Key Characteristics:**
- Semantic tokens only; components never carry raw hex.
- Zero radius everywhere; corners are live, not softened.
- Black rules and ink planes carry structure; no shadows, no elevation.
- Red is rationed to the wedge; black is the everyday work action.
- Two typefaces total: condensed stencil display over grotesque body/data.
- Tabular figures on everything measured (km, ETA, price, rating).
- One authored motion moment for the whole site.

## Colors

Three inks on cream newsprint: soot black for structure and everyday action, a printer's red spent only on urgency and the diagonal, and a channel green reserved for WhatsApp.

### Primary
- **Soot Black** (`action-primary`): the everyday work action, all body text, and every rule and frame in the system. The default button is black, not red.
- **Press Black** (`action-primary-dark`): the pressed/hover deepening of the black button only.

### Secondary
- **Press Red** (`emergency`): the wedge, the emergency plane, the active nav block, the focus ring, the caret, and the selection highlight. It marks what pushes forward, never a routine action.
- **Deep Press Red** (`emergency-dark`): hover state of the red button and the darker half of the SOS band's split diagonal.
- **Urgent Oxblood** (`action-urgent`): the urgent (not emergency) tier and the star fill in ratings.
- **Second-Pass Red** (`emergency-plancha`): red printed on a black plane. The base red only reaches 3.3:1 on ink black; this lighter pass reaches 5.4:1. It exists exclusively for red type, rules, and stop markers sitting on `surface-inverse`.

### Tertiary
- **Channel Green** (`whatsapp`): a print rendition of the WhatsApp green, darkened until it clears 4.5:1 on cream. It is a channel identifier, not an aesthetic accent, and appears only on controls literally labeled WhatsApp.
- **Available Green** / **Busy Gray** (`status-available`, `status-busy`): the two-state availability stamp; nothing else.

### Neutral
- **Cream Newsprint** (`surface-page`): the page floor, always carrying paper grain.
- **Fresh Sheet** (`surface-card`): panels, plates, inputs, and rows — one step brighter than the floor, which is how surfaces separate without a shadow.
- **Full Ink** (`surface-inverse`): the nav bar, footer, panel title bars, the measurement band, and the route section.
- **Ink Text / Halftone Text** (`foreground-primary`, `foreground-secondary`): primary copy and its quieter second line.
- **Paper White / Aged Paper** (`foreground-inverse`, `foreground-inverse-secondary`): type on ink planes, and its secondary line.
- **Halftone Gray** (`accent-primary`): the dot color of the paper screen, not an interface gray.
- **Ink Rule / Faint Rule** (`border-primary`, `border-subtle`): the 2–3px black frame that structures every panel, and the hairline used for scrollbar and disabled strokes.

### Named Rules
**The Rationed Red Rule.** Black is the everyday action; red is spent only on the wedge, on emergency and urgent, on the active stop, and on focus. If a screen's red covers more than the diagonal plus one control, the ration has been broken.

**The Second-Pass Rule.** Red on a black plane is always `emergency-plancha`, never the base red. The base red on ink black measures 3.3:1 and fails.

**The Channel Green Rule.** Green identifies WhatsApp and nothing else. It never becomes a success color, a decorative accent, or a second brand hue.

## Typography

**Display Font:** Big Shoulders (with Arial Narrow, Helvetica Neue, Arial)
**Body Font:** Archivo (with ui-sans-serif, system-ui)

Two families, not four. The four legacy token names (`--font-heading`, `--font-body`, `--font-caption`, `--font-data`) are preserved so upstream surfaces keep compiling, but they resolve to exactly two real faces: heading to the stencil, the other three to the grotesque.

**Character:** Condensed stencil capitals set the poster register — headlines are shouted, tight, and always uppercase. Everything read or measured drops into a plain table grotesque that stays quiet under them. The display face ships with an explicit fallback stack because Next has no metric overrides for it, and without one the headline jumps size on font load.

### Hierarchy
- **Display** (800, `clamp(3rem, 10.5vw, 6.75rem)`, 0.82): the landing headline only. Uppercase, set on a single shared rotation axis, bled off the left viewport edge.
- **Headline** (800, 1.875rem rising to 2.25rem at `md`, 1.0): section titles, one per train car. Uppercase.
- **Title** (800, 1.25–1.875rem, 1.0): plate and stop names inside panels. Uppercase.
- **Body** (400, 1rem; 1.125rem for the lead paragraph, 1.4–1.6): all read prose, capped around 32rem for the lead and 24–36rem elsewhere.
- **Label** (800, 0.75rem, 0.08–0.14em tracking, uppercase): panel title bars, stamps, tags, nav items, and the measurement band. The wider 0.14em tracking belongs to title bars.
- **Data** (600, 0.875rem, tabular): ratings and numeric values in prose.

### Named Rules
**The Tabular Measurement Rule.** Anything the product asks the user to believe — distance, ETA, price, rating, dates — carries `.cifras` (or is a `<time>` element) and renders in tabular figures. Numbers that shift width while scanning are not evidence.

**The No-Kicker Rule.** Sections open on the headline. There is no eyebrow, kicker, or small-caps label floating above a title anywhere in this system; the black panel title bar is the only labeled opener, and it is a bar, not a floating line of type.

**The All-Caps Display Rule.** The stencil face is used in uppercase only. It has no lowercase register in this world.

## Layout

Content runs in a centered `max-w-7xl` (80rem) column with `16px` gutters, opening to `24px` from `md` up. Sections stack as full-bleed bands, each separated from the next by a `2px` black rule on the section edge — the rule is the divider, so no vertical margin is ever needed between cars. Vertical rhythm inside a section is `32px` (`py-xl`), rising to `48px` (`py-2xl`) for the closing route section.

Spacing uses a six-step scale (4 / 8 / 16 / 24 / 32 / 48) exposed as `--spacing-xs … --spacing-2xl`. Note that this scale shares Tailwind v4's `max-w-*` namespace: use arbitrary widths (`max-w-[28rem]`) or `max-w-7xl`, never `max-w-md`.

Breakpoints in real use are `sm` 640px, `md` 768px, and `lg` 1024px. The header collapses to the menu at `lg`, not `md`, because the nav does not fit on a portrait tablet. The world's own responsive rule governs geometry: **the diagonal steepens as the screen gets taller and relaxes as it gets wider** — `.cuna` runs near-vertical below 768px and lies down above it. Diagonals are never simply dropped on mobile; they change angle so the compositional axis survives.

Touch targets are at least 44px tall everywhere (button sizes are 44 / 48 / 56px, footer links carry `min-h-11`, the logo carries `min-h-11`), because the confirmed scene is one-handed phone use outdoors.

**The Full-Bleed Left Rule.** When a display block bleeds off the left edge, it uses `.sangra-izq`, which cancels both the container padding and the centering margin of `max-w-7xl` so the block reaches the viewport edge at every width. Rotating the block instead pulls it back inboard on desktop and breaks the bleed.

## Elevation & Depth

**This system has no elevation.** There are no shadow tokens, no blur, no translucent scrims used as depth. Depth is printing: a plane of full ink against cream stock, a 2px black rule framing a panel, a halftone screen sitting under a photograph, and a diagonal wedge passing *over* content by multiplication. Two surfaces separate because one is a brighter sheet than the other and a black rule runs between them, never because one is floating.

Hover depth is likewise material, not spatial: a plate's frame turns red, a row's ground shifts to the darker paper, an ink plane inverts its type. The only translation in the system is the button's 2px forward push on press — the train moving, not the button lifting.

### Named Rules
**The Ink-Not-Air Rule.** Never add a box-shadow, a drop-shadow, a backdrop blur, or a translucent gray band to create separation. Separate with a black rule, a full-ink plane, or a step between `surface-page` and `surface-card`.

## Shapes

Every radius token is `0px`. Corners are live; nothing in this world is rounded, including the focus ring, the scrollbar thumb, and the availability dot (a square, not a circle).

Form language is cut, not curved. Four recurring geometries:

- **The wedge** (`.cuna`, `.filo-cuna`): the diagonal that pushes the action, applied as `clip-path` on a plane rather than as a gradient inside an image. `.filo-cuna` is its edge-band form.
- **The pennant shear** (`.banderin`, `.banderin-izq`): the button's slanted trailing edge, `0.7em` of shear, taken from the locomotive pennant. Every solid button carries it; the ghost button cancels it with `.banderin-none` because ghost is type, not a plate.
- **The corner triangle**: a fixed-geometry red corner entering the top-left of a photographic plate. Its size is fixed (`h-24 w-36`, `h-28 w-40` on the lead plate) so it lands identically on every plate regardless of the photo's luminance.
- **The plate** (`plancha`): a 2px black frame around a fresh-sheet ground, often with a full-ink title bar across its top.

**The Closed-Frame Rule.** A sheared element still closes its frame. Use `.filete-banderin`, which paints the border with the background across `border-box` and `padding-box` so the clip cuts both layers, instead of an inset shadow that the clip would leave open on the slanted side.

## Components

### Buttons
Stencil plates with a sheared trailing edge; they push forward when pressed.

- **Shape:** square corners (0px) plus a `0.7em` shear on the trailing edge (`.banderin`). Extra right padding compensates for the cut.
- **Sizes:** 44px (`sm`), 48px (`md`), 56px (`lg`) tall. Uppercase display face, 800 weight, `0.06em` tracking.
- **Primary:** soot-black plate with paper-white type; hover deepens to press black. This is the everyday action.
- **Emergency / Urgent:** press red and urgent oxblood plates. Reserved for the wedge — pushing into help, not routine navigation.
- **WhatsApp:** channel-green plate, used only on controls labeled WhatsApp.
- **Outline:** transparent ground with a 2px painted frame that survives the shear; on hover the frame floods to solid ink and the type inverts.
- **Ghost:** type only, no plate and no shear; hover turns red and underlines at 2px.
- **Press / Focus:** `active` translates 2px along the direction of travel over 150ms on `--ease-press`. Focus is a 3px square red outline at 2px offset, applied globally to every interactive element.
- **Disabled:** 40% opacity, desaturated to gray — the plate stops being an ink.

### Chips / Tags
- **Tag:** a stencil outline label — transparent ground, 1px black frame, uppercase 0.75rem at `0.08em`. Used for specialties.
- **Availability stamp:** a solid ink plate (available green / busy gray) with paper-white uppercase type and a small square dot.
- **ETA stamp:** fresh-sheet ground, 2px black frame, tabular figures, clock glyph at 12px.

### Cards / Containers
The recurring container is the **plate**, not a card.

- **Corner Style:** square (0px).
- **Background:** fresh sheet on the cream floor; full ink when the plate is a header or a measurement band.
- **Border:** 2px black on all sides; internal divisions are 2px black rules, including between grid cells.
- **Shadow:** none (see Elevation & Depth).
- **Internal Padding:** 16px body, 16px × 6px for title bars and measurement bands.
- **Photographic area:** always `.plancha-foto` (grayscale, contrast 1.55, brightness 1.06) plus `.plancha-foto-trama`, a `color-burn` halftone whose dot closes in the shadows and opens in the highlights. Never a flat gray overlay. Plate photography is clipped on a diagonal; on hover the lead plate returns to full color.
- **Measurement band:** a full-ink strip at the bottom of a plate, bled to the plate edges, with distance at one end and ETA at the other and a red rule spanning between them. On ink, that rule uses second-pass red.

### Inputs / Fields
- **Style:** fresh-sheet ground, 2px black frame, square, 48px tall, body face.
- **Focus:** the frame turns press red; the small ink corner-notch at the bottom-right turns red with it. No glow, no ring blur.
- **Error:** the message prints in press red under the field; the required marker is a red asterisk.
- **Caret:** press red globally.

### Navigation
- **Header:** a sticky full-ink plane with a 3px red bottom rule, a red wedge entering from the left behind the wordmark, and the paper screen over the whole bar.
- **Items:** uppercase display face, 0.875rem, `0.08em`, aged-paper by default, paper-white on hover with a 10% white ground.
- **Active:** a solid red block behind the item — the current stop on the line. An anchor link is never an active stop.
- **Mobile:** below `lg`, a stacked list inside the ink plane; the active item takes a 3px red left rule and a 15% red ground instead of the solid block.
- **Footer:** the same ink plane and paper screen, a red pennant rule under the wordmark, and link rows at 44px minimum with a red 2px underline on hover.

### Stop Sequence (signature)
The system's canonical way to present a list of workshops, and the replacement for a grid of identical cards. The nearest stop leads with its own full plate — photo, name, rating, tags, address, measurement band, and both actions — and the remaining stops run beneath it as ruled rows on a rail. Each row carries a square red stop marker that fills on hover, the name in display caps turning red, the rating, and distance/ETA in tabular figures. **Distance and ETA are never hidden at small widths**; they are the product's proof and the phone is the primary scene, not the reduced one. The WhatsApp control sits as a positioned sibling of the row link, not nested inside it, so both keep their real touch area.

### Ruled Manifest (signature)
A plate whose title bar states what it is and counts its rows, then a list of ruled rows (two columns from `md`) where each row is a whole link: icon, uppercase label, one line of description, and a red chevron that advances 4px on hover while the entire row floods to press red and the type inverts. Used where a category chooser would otherwise become a tile grid.

### Progress Rail (signature)
The single authored motion moment of the site. A red sheared parallelogram travels the viewport width tied to scroll progress, fixed just under the header. It is driven by requestAnimationFrame writing a `--avance` variable (0→1) rather than `animation-timeline: scroll()`, because that API does not run in Safari and the primary scene is a stranded driver on a phone. It has no background track — this world separates with ink rules, not translucent gray bands — and it stops updating entirely under `prefers-reduced-motion`.

### Empty States
An empty region is stated, never left silent. A dashed 2px black frame on cream, a display-caps line naming the empty container ("Vagón vacío"), one sentence of body explaining when it fills, and an outline button toward the action that fills it.

### Motion
Two easings and nothing else: `--ease-drive` (`cubic-bezier(0.16, 1, 0.3, 1)`) for arrivals, so the train decelerates into the station, and `--ease-press` (`cubic-bezier(0.3, 0, 0.2, 1)`) at 150ms for presses and hovers. Entrances use `.registra` — a 520ms settle from 0.55 opacity and 10px, a second ink landing a beat late — and never start from invisible. `prefers-reduced-motion` is honored globally and in the rail component itself.

## Do's and Don'ts

### Do:
- **Do** write semantic tokens (`bg-action-primary`, `text-foreground-secondary`, `border-border-primary`) and never a raw hex in a component. The world reassigns from `globals.css`, and any hardcoded value breaks that.
- **Do** use soot black for the everyday action and reserve red for the wedge, emergency, urgent, the active stop, and focus.
- **Do** switch to `emergency-plancha` for any red type, rule, or marker on an ink-black plane.
- **Do** frame with 2px black rules and separate sections with a rule on the section edge.
- **Do** give every measured value `.cifras` so distance, ETA, price, and rating render in tabular figures.
- **Do** keep interactive targets at 44px minimum and keep distance and ETA visible at 390px.
- **Do** let diagonals steepen on tall screens rather than removing them on mobile.
- **Do** close a frame under a shear with `.filete-banderin`.
- **Do** state empty regions in display caps with a named container and a way out.

### Don't:
- **Don't** add a box-shadow, drop-shadow, backdrop blur, or translucent gray band. This system conveys depth with ink, rules, and paper steps only.
- **Don't** round anything. Every radius token is 0 and that is what squares the site's inherited `rounded-*` utilities.
- **Don't** use green for anything other than a WhatsApp-labeled control.
- **Don't** make red the default button color; a red everyday action spends the ration and kills the wedge.
- **Don't** add an eyebrow or kicker line above a heading. Sections open on the headline or on a black title bar.
- **Don't** introduce a third or fourth typeface. The four `--font-*` token names exist for compatibility and must keep resolving to the two shipped families.
- **Don't** put a photograph on a surface without the halftone plate treatment, and don't substitute a flat gray tint for the `color-burn` screen.
- **Don't** replace the stop sequence with a grid of three identical cards, which is the topology this world rejects by name.
- **Don't** add a second orchestrated motion moment. The scroll rail is the one authored moment; everything else is press and hover feedback.
- **Don't** use `max-w-{xs..2xl}`; the spacing scale occupies that namespace in Tailwind v4. Use `max-w-[28rem]` or `max-w-7xl`.
