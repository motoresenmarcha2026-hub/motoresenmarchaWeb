---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

## Scope

Superficie: `src/app/page.tsx` (portada pública). Modo del visitante: **Persuade**.

Audiencia: conductor varado y conductor que planea, con peso igual y jerarquía explícita.
Acción: iniciar el contacto por WhatsApp. Prueba disponible: calificación real, distancia y
ETA reales, especialidad. Restricción: no existe cifra de mecánicos verificados; no inventar.

## Direction contract

THESIS: El sitio es el vehículo que lleva el problema del conductor hasta quien lo arregla;
cada sección es un vagón y cada taller una parada. Rechaza el hero partido con foto de stock
y la rejilla de tarjetas iguales.

OWN-WORLD: Papel periódico crema, negro hollín, rojo racionado a la cuña que empuja la
acción, verde de canal solo en el contacto. Versales de plantilla condensadas (Big Shoulders
Display) sobre grotesca de tabla (Archivo, cifras tabulares). Filetes negros enmarcando todo;
fotografía en halftone bajo cuña diagonal. Botón primario: paralelogramo rojo con flecha.

STORY: El conductor ve en segundos quién está cerca y disponible, cree en la distancia y el
ETA porque son reales, y manda el mensaje.

FIRST VIEWPORT: Barra de navegación negra con cuña roja y bloque rojo en el activo (el
componente propio del sistema, válido en todo el sitio). Debajo, columna izquierda con
versales anguladas a sangre sobre crema y el panel EL TALLER MÁS CERCANO (nombre, km, ETA);
a la derecha la cuña roja entrando bajo fotografía en halftone. Dos acciones: paralelogramo
rojo "Pedir ayuda ahora" y secundaria "Ver talleres". Sin eyebrow.

FORM: Tren de agitación constructivista, retador del catálogo con veredicto competitiva,
elegido por el usuario sobre la asignada (índice 3, Catálogo de Despiece) y sobre la salida
estándar. Seed 6c8762a5.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Signature interaction and motion grammar

El tren avanza con el scroll: la cuña roja recorre el viewport ligada al scroll
(`animation-timeline: scroll()`), acotada y anulada bajo `prefers-reduced-motion`. Los
estados presionados empujan hacia adelante: la flecha del botón avanza y la cuña entra.
Un solo momento orquestado, no efectos dispersos.

## Responsive rule del mundo

La diagonal se empina en pantallas altas y se relaja en anchas. En celular la cuña tiende a
vertical y se convierte en banda de borde izquierdo, de modo que el orden de lectura queda
vertical y no se pierde legibilidad — el riesgo que la carta declaró.

## Unresolved

Resuelto. El hero y las planchas de taller usan la fotografía real de Supabase Storage que
los propios talleres subieron, tramada por `.plancha-foto` + `.plancha-foto-trama`. El
hotlink de Unsplash se retiró del código y del `next.config`. El camino de respaldo de
`talleres/mock.ts` ya no devuelve foto de stock: sin imagen propia, la UI dibuja la plancha
de tinta con su trama, que es lo que la tesis pide. Queda abierto solo `picsum` para
avatares de mock, fuera del alcance de esta superficie.
