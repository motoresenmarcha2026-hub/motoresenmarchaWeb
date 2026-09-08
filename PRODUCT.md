# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primario — conductores, en dos escenas que pesan igual.** La portada debe servir a ambas
con jerarquía explícita entre ellas, no promediarlas:

1. **Conductor varado.** Su auto falló ahora. Llega en celular, con prisa, posiblemente a la
   orilla de la carretera o en un estacionamiento. Su éxito es mandar un WhatsApp a alguien
   que pueda ayudarlo, rápido.
2. **Conductor que planea.** Busca taller para un servicio, una revisión o una refacción.
   Compara, lee reseñas y calificaciones, decide con calma. Su éxito es encontrar el taller
   correcto y confiar en él antes de contactarlo.

**Secundarios — el lado de la oferta.** Dueños de talleres y mecánicos independientes
(rol `taller`), y refaccionarias / vendedores de autopartes (rol `vendedor`). Trabajan
sentados, en pantalla grande, durante su jornada: administran su perfil, su inventario y
las solicitudes que entran. Un rol `admin` opera la plataforma.

## Product Purpose

Marketplace mexicano que conecta conductores con mecánicos, talleres y vendedores de
refacciones, incluyendo un camino explícito de emergencia (SOS). El producto no procesa la
transacción: la **cierra por WhatsApp**. Su trabajo termina cuando el conductor y el taller
están hablando entre ellos.

Éxito = un contacto real iniciado. Para el conductor varado, en el menor tiempo posible;
para el que planea, con la confianza de haber elegido bien.

## Positioning

El contacto se cierra en el canal donde el gremio automotriz mexicano ya opera todos los
días — WhatsApp — en vez de encerrar la conversación dentro de la plataforma. El sitio
aporta lo que WhatsApp no tiene: quién está cerca, quién está disponible, cuánto tarda en
llegar y cómo lo calificaron otros. Distancia y ETA son reales (haversine sobre coordenadas
del taller), no estimaciones genéricas.

## Operating Context

- **Dos escenas físicas distintas y ambas reales.** El lado público se usa en celular, en la
  calle, a cualquier hora del día o de la noche. Los paneles (`/panel`, `/vendedor`,
  `/admin`) se usan en escritorio, dentro del negocio, durante la jornada. La landing y los
  paneles pueden tener temperatura distinta dentro de un mismo mundo visual.
- **Salida del producto:** deep links `wa.me` con mensaje preescrito.
- **Ubicación:** geolocalización del navegador al entrar a `/talleres`; si el usuario la
  niega, geocodificación por dirección vía Nominatim/OSM. Mapa Leaflet con pin arrastrable y
  círculo de radio (2→50 km o "Todos"). El taller coloca su propio pin en `/panel/cuenta`;
  sin coordenadas no aparece en búsquedas por cercanía.
- **Ciclo completo del conductor:** solicitar → WhatsApp → agendar cita → calificar.
- **Tiempo real:** el panel del taller recibe solicitudes y citas por Supabase Realtime.
- **Idioma:** español mexicano, en todo el producto.

## Capabilities and Constraints

**Hay:** 4 roles (`conductor`, `taller`, `vendedor`, `admin`) · auth por email/password y
Google OAuth · marketplace de talleres con filtros, cercanía y ETA · perfiles con reseñas y
calificación agregada · solicitudes de servicio con tipo de problema y prioridad ·
agendado de citas · reseñas post-servicio · marketplace de refacciones con filtros por
categoría, texto y precio · CRUD de inventario para vendedores · panel de administración.

**No hay, y no debe insinuarse que hay:**
- Pagos, carrito o checkout. El contacto es por WhatsApp y nada más.
- Reseñas de refacciones o de vendedores (solo de talleres).
- Horarios reales por taller: hoy son franjas fijas 09:00–17:30 sin protección contra
  doble reserva.
- Confirmación de email al registrarse (está apagada).
- Página "Sobre nosotros" (falta el texto del cliente).

**Restricciones técnicas:** Supabase con RLS por dueño en todas las tablas de escritura ·
plan Free · Storage público para fotos de talleres y refacciones · desplegado en Vercel ·
la sesión vive en `src/proxy.ts` (en Next 16 el middleware se llama Proxy).

**Decisión abierta:** si el producto monetiza, los pagos serían una feature nueva completa.
No está decidido.

## Brand Commitments

- **Nombre:** "Motores en Marcha". Vinculante.
- **Dominio en producción:** `motoresenmarcha.com`. El sitio está entregado al cliente
  (2026-08-14) y en vivo.
- **Logo:** `public/logo.png`, también `src/app/icon.png` y `apple-icon.png`. Vinculante
  como activo; su presentación no lo es.
- **El verde de WhatsApp** es un color de canal, no una elección estética: identifica el
  medio real por el que se cierra el contacto. Cualquier mundo visual tiene que alojarlo.
- **Voz:** español mexicano, directo, sin jerga técnica hacia el conductor.
- **Restricción visual fijada por el usuario (2026-09-07):** el mundo visual del sitio se
  deriva de la cultura del transporte pesado / camión diésel. Es una dirección estética,
  no un cambio de producto: el producto sigue sirviendo a conductores de auto y su copy
  y sus categorías no cambian.

## Evidence on Hand

**Real y usable como prueba:**
- Calificaciones y número de reseñas por taller, recalculados por trigger en la base.
- Distancia y ETA calculados de verdad (haversine, `src/features/talleres/geo.ts`).
- Especialidades y categorías de problema reales (catálogos estáticos).
- Fotos de talleres y avatares servidos desde Supabase Storage.

**Ausencias que el trabajo futuro NO debe inventar:**
- **No existe cifra de mecánicos verificados.** La landing decía "+500 mecánicos
  verificados" y "Respuesta en minutos"; el usuario confirmó el 2026-09-07 que **no es
  verdad todavía** y que se retira del sitio. No reintroducir esa cifra ni ninguna
  equivalente hasta que sea cierta.
- Los 8 talleres en la base son **semilla de demostración** y se borran con el botón
  "Eliminar datos de demostración" de `/admin` cuando el negocio arranque en serio.
- No hay testimonios, casos, prensa, ni clientes nombrables.
- No hay datos de refacciones: la migración `0006` no se ha corrido, así que
  `/refacciones` y `/vendedor/*` muestran estados vacíos.
- Los textos legales (`/terminos`, `/privacidad`, `/cookies`) existen pero **no han sido
  revisados por un abogado**.

## Product Principles

1. **El contacto es el producto.** Toda superficie se mide por si acerca o aleja el momento
   en que conductor y taller están hablando por WhatsApp.
2. **La urgencia y la calma conviven, pero nunca empatan.** Cada superficie declara cuál de
   las dos manda en ella; ninguna las promedia.
3. **Probar con lo que existe.** Calificación, distancia, ETA y especialidad son la prueba.
   Las cifras que no son ciertas no se escriben.
4. **El celular en la calle es el caso difícil, no el reducido.** Si algo solo funciona
   cómodo en escritorio, no está terminado.
5. **El lado de la oferta también es usuario.** Un taller o una refaccionaria administra su
   negocio aquí durante su jornada; su panel merece la misma calidad que la portada.

## Accessibility & Inclusion

Uso a una mano en celular, a la intemperie y a cualquier hora, en un momento de estrés.
Esto obliga a: contraste alto y verificado sobre las superficies reales del producto, áreas
táctiles generosas, tipografía que se lee sin acercarse, y un presupuesto de carga honesto
para señal móvil mala. Español mexicano en todo el producto.
