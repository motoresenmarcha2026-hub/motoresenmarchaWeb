-- Motores en Marcha — datos de prueba (seed). Idempotente.
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de 0001_init.sql.

set local search_path = public;

-- Horario estándar reutilizado.
-- (lunes a viernes 08-18, sábado 09-14, domingo cerrado)

insert into public.talleres
  (id, nombre, slug, especialidades, rating, num_resenas, disponibilidad,
   lat, lng, direccion, ciudad, distancia_km, eta_min, foto_url, avatar_url,
   whatsapp, descripcion, mecanico_principal, horarios, precio_desde,
   verificado, destacado)
values
  ('t1','Taller El Rápido','taller-el-rapido',
   ARRAY['motor','frenos','diagnostico'],4.8,127,'available',
   19.4326,-99.1332,'Av. Insurgentes Sur 1200, Del Valle','Ciudad de México',1.2,15,
   'https://picsum.photos/seed/meca-1486262715619/800/600','https://picsum.photos/seed/face12/150',
   '+525512345678',
   'Más de 15 años de experiencia en mecánica general y diagnóstico computarizado. Atención rápida y transparente, con presupuesto sin compromiso.',
   'Carlos Medina',
   '[{"dia":"lunes","abre":"08:00","cierra":"18:00"},{"dia":"martes","abre":"08:00","cierra":"18:00"},{"dia":"miercoles","abre":"08:00","cierra":"18:00"},{"dia":"jueves","abre":"08:00","cierra":"18:00"},{"dia":"viernes","abre":"08:00","cierra":"18:00"},{"dia":"sabado","abre":"09:00","cierra":"14:00"},{"dia":"domingo","abre":"","cierra":"","cerrado":true}]'::jsonb,
   350,true,true),

  ('t2','AutoServicio Delgado','autoservicio-delgado',
   ARRAY['electrico','bateria','aire'],4.6,89,'available',
   19.4069,-99.1716,'Calle Xola 250, Narvarte','Ciudad de México',2.7,22,
   'https://picsum.photos/seed/meca-1530046339160/800/600','https://picsum.photos/seed/face33/150',
   '+525587654321',
   'Especialistas en sistema eléctrico automotriz, baterías y climas. Diagnóstico preciso para fallas eléctricas complejas.',
   'Ana Delgado',
   '[{"dia":"lunes","abre":"08:00","cierra":"18:00"},{"dia":"martes","abre":"08:00","cierra":"18:00"},{"dia":"miercoles","abre":"08:00","cierra":"18:00"},{"dia":"jueves","abre":"08:00","cierra":"18:00"},{"dia":"viernes","abre":"08:00","cierra":"18:00"},{"dia":"sabado","abre":"09:00","cierra":"14:00"},{"dia":"domingo","abre":"","cierra":"","cerrado":true}]'::jsonb,
   400,true,true),

  ('t3','Frenos y Suspensión Torres','frenos-suspension-torres',
   ARRAY['frenos','suspension','llantas'],4.9,203,'busy',
   19.3907,-99.1436,'Eje Central 890, Portales','Ciudad de México',3.4,28,
   'https://picsum.photos/seed/meca-1487754180451/800/600','https://picsum.photos/seed/face54/150',
   '+525511223344',
   'Frenos, suspensión y alineación con equipo de última generación. Garantía por escrito en todos nuestros trabajos.',
   'Ricardo Torres',
   '[{"dia":"lunes","abre":"08:00","cierra":"18:00"},{"dia":"martes","abre":"08:00","cierra":"18:00"},{"dia":"miercoles","abre":"08:00","cierra":"18:00"},{"dia":"jueves","abre":"08:00","cierra":"18:00"},{"dia":"viernes","abre":"08:00","cierra":"18:00"},{"dia":"sabado","abre":"09:00","cierra":"14:00"},{"dia":"domingo","abre":"","cierra":"","cerrado":true}]'::jsonb,
   300,true,true),

  ('t4','Mecánica Express 24/7','mecanica-express-24-7',
   ARRAY['general','motor','bateria','llantas'],4.4,56,'available',
   19.4501,-99.1276,'Av. Chapultepec 45, Roma Norte','Ciudad de México',0.8,10,
   'https://picsum.photos/seed/meca-1600861195091/800/600','https://picsum.photos/seed/face68/150',
   '+525599887766',
   'Servicio de emergencia las 24 horas. Auxilio vial, cambio de batería y llantas a domicilio en minutos.',
   'Miguel Ángel Ruiz',
   '[{"dia":"lunes","abre":"08:00","cierra":"18:00"},{"dia":"martes","abre":"08:00","cierra":"18:00"},{"dia":"miercoles","abre":"08:00","cierra":"18:00"},{"dia":"jueves","abre":"08:00","cierra":"18:00"},{"dia":"viernes","abre":"08:00","cierra":"18:00"},{"dia":"sabado","abre":"09:00","cierra":"14:00"},{"dia":"domingo","abre":"","cierra":"","cerrado":true}]'::jsonb,
   250,false,false),

  ('t5','Transmisiones González','transmisiones-gonzalez',
   ARRAY['transmision','motor','diagnostico'],4.7,141,'available',
   19.3629,-99.1585,'Calzada de Tlalpan 1500, Álamos','Ciudad de México',4.9,35,
   'https://picsum.photos/seed/meca-1503376780353/800/600','https://picsum.photos/seed/face15/150',
   '+525522334455',
   'Expertos en cajas automáticas y estándar. Reconstrucción y mantenimiento de transmisiones de todas las marcas.',
   'Fernando González',
   '[{"dia":"lunes","abre":"08:00","cierra":"18:00"},{"dia":"martes","abre":"08:00","cierra":"18:00"},{"dia":"miercoles","abre":"08:00","cierra":"18:00"},{"dia":"jueves","abre":"08:00","cierra":"18:00"},{"dia":"viernes","abre":"08:00","cierra":"18:00"},{"dia":"sabado","abre":"09:00","cierra":"14:00"},{"dia":"domingo","abre":"","cierra":"","cerrado":true}]'::jsonb,
   500,true,false),

  ('t6','Clima Auto Fresco','clima-auto-fresco',
   ARRAY['aire','electrico'],4.5,72,'busy',
   19.4284,-99.1276,'Av. Cuauhtémoc 320, Doctores','Ciudad de México',2.1,18,
   'https://picsum.photos/seed/meca-1580273916550/800/600','https://picsum.photos/seed/face25/150',
   '+525533445566',
   'Recarga de gas, reparación de compresores y mantenimiento de aire acondicionado automotriz.',
   'Laura Jiménez',
   '[{"dia":"lunes","abre":"08:00","cierra":"18:00"},{"dia":"martes","abre":"08:00","cierra":"18:00"},{"dia":"miercoles","abre":"08:00","cierra":"18:00"},{"dia":"jueves","abre":"08:00","cierra":"18:00"},{"dia":"viernes","abre":"08:00","cierra":"18:00"},{"dia":"sabado","abre":"09:00","cierra":"14:00"},{"dia":"domingo","abre":"","cierra":"","cerrado":true}]'::jsonb,
   450,true,false),

  ('t7','Llantera y Balanceo Cruz','llantera-balanceo-cruz',
   ARRAY['llantas','suspension'],4.3,98,'available',
   19.4102,-99.1889,'Av. Revolución 780, San Pedro de los Pinos','Ciudad de México',5.6,40,
   'https://picsum.photos/seed/meca-1605164599901/800/600','https://picsum.photos/seed/face51/150',
   '+525544556677',
   'Venta y reparación de llantas, alineación y balanceo. Servicio de auxilio vial por ponchadura.',
   'José Cruz',
   '[{"dia":"lunes","abre":"08:00","cierra":"18:00"},{"dia":"martes","abre":"08:00","cierra":"18:00"},{"dia":"miercoles","abre":"08:00","cierra":"18:00"},{"dia":"jueves","abre":"08:00","cierra":"18:00"},{"dia":"viernes","abre":"08:00","cierra":"18:00"},{"dia":"sabado","abre":"09:00","cierra":"14:00"},{"dia":"domingo","abre":"","cierra":"","cerrado":true}]'::jsonb,
   200,false,false),

  ('t8','Diagnóstico Digital MotorTech','diagnostico-digital-motortech',
   ARRAY['diagnostico','electrico','motor'],5.0,64,'available',
   19.4445,-99.155,'Av. Patriotismo 210, San Pedro de los Pinos','Ciudad de México',3.0,24,
   'https://picsum.photos/seed/meca-1632823469850/800/600','https://picsum.photos/seed/face60/150',
   '+525555667788',
   'Diagnóstico computarizado avanzado para autos modernos e híbridos. Escaneo completo y reporte detallado.',
   'Diana Salas',
   '[{"dia":"lunes","abre":"08:00","cierra":"18:00"},{"dia":"martes","abre":"08:00","cierra":"18:00"},{"dia":"miercoles","abre":"08:00","cierra":"18:00"},{"dia":"jueves","abre":"08:00","cierra":"18:00"},{"dia":"viernes","abre":"08:00","cierra":"18:00"},{"dia":"sabado","abre":"09:00","cierra":"14:00"},{"dia":"domingo","abre":"","cierra":"","cerrado":true}]'::jsonb,
   380,true,false)
on conflict (id) do update set
  nombre = excluded.nombre,
  slug = excluded.slug,
  especialidades = excluded.especialidades,
  rating = excluded.rating,
  num_resenas = excluded.num_resenas,
  disponibilidad = excluded.disponibilidad,
  lat = excluded.lat, lng = excluded.lng,
  direccion = excluded.direccion, ciudad = excluded.ciudad,
  distancia_km = excluded.distancia_km, eta_min = excluded.eta_min,
  foto_url = excluded.foto_url, avatar_url = excluded.avatar_url,
  whatsapp = excluded.whatsapp, descripcion = excluded.descripcion,
  mecanico_principal = excluded.mecanico_principal, horarios = excluded.horarios,
  precio_desde = excluded.precio_desde, verificado = excluded.verificado,
  destacado = excluded.destacado;

-- Reseñas: se regeneran en cada seed.
delete from public.resenas;
insert into public.resenas (taller_id, autor, autor_avatar_url, rating, comentario, servicio, created_at)
values
  ('t1','Sofía R.','https://picsum.photos/seed/face45/100',5,'Llegaron en 15 minutos cuando mi auto no arrancaba. Súper profesionales y el precio justo lo que dijeron. Totalmente recomendados.','Diagnóstico de motor','2026-07-28T14:30:00Z'),
  ('t1','Pedro M.','https://picsum.photos/seed/face13/100',5,'Carlos me explicó todo con detalle y me mandó fotos del avance por WhatsApp. Confianza total.','Cambio de frenos','2026-07-15T10:00:00Z'),
  ('t1','Gabriela N.','https://picsum.photos/seed/face47/100',4,'Buen servicio y rápido. Solo tardaron un poco en conseguir una refacción, pero avisaron a tiempo.','Servicio general','2026-06-30T16:45:00Z'),
  ('t2','Luis T.','https://picsum.photos/seed/face52/100',5,'Encontraron una falla eléctrica que otros tres talleres no pudieron. Excelentes con el diagnóstico.','Sistema eléctrico','2026-07-20T09:15:00Z'),
  ('t3','Marcela V.','https://picsum.photos/seed/face32/100',5,'Mis frenos quedaron como nuevos y me dieron garantía por escrito. Volveré sin duda.','Frenos y suspensión','2026-08-01T11:30:00Z');
