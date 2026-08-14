import type { Metadata } from "next";
import { TituloLegal, Seccion } from "../legal-ui";

export const metadata: Metadata = {
  title: "Aviso de privacidad — Motores en Marcha",
  description:
    "Aviso de privacidad: qué datos recopilamos y cómo los usamos en Motores en Marcha.",
};

export default function PrivacidadPage() {
  return (
    <>
      <TituloLegal actualizado="14 de agosto de 2026">
        Aviso de privacidad
      </TituloLegal>

      <Seccion titulo="1. Responsable">
        <p>
          Motores en Marcha es responsable del tratamiento de los datos
          personales recabados a través de la plataforma{" "}
          <strong>motoresenmarcha.com</strong>. Contacto:{" "}
          <a
            className="text-action-primary underline"
            href="mailto:motoresenmarcha2026@gmail.com"
          >
            motoresenmarcha2026@gmail.com
          </a>
          .
        </p>
      </Seccion>

      <Seccion titulo="2. Datos que recopilamos">
        <ul>
          <li>
            <strong>Cuenta:</strong> nombre, correo electrónico, teléfono /
            WhatsApp y ciudad.
          </li>
          <li>
            <strong>Talleres:</strong> además, nombre del negocio, dirección,
            especialidades, horarios y fotografías.
          </li>
          <li>
            <strong>Solicitudes y citas:</strong> tipo de problema,
            descripción, ubicación proporcionada, fecha y hora.
          </li>
          <li>
            <strong>Inicio de sesión con Google:</strong> nombre, correo y foto
            de perfil que Google comparte al autorizar el acceso.
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="3. Para qué usamos tus datos">
        <ul>
          <li>Crear y administrar tu cuenta.</li>
          <li>
            Conectarte con Talleres: tu nombre, teléfono y ubicación se
            comparten con el Taller al enviar una solicitud o agendar una cita.
          </li>
          <li>Mostrar reseñas y calificaciones públicas.</li>
          <li>Mantener la seguridad y el funcionamiento de la plataforma.</li>
        </ul>
        <p>No vendemos tus datos personales a terceros.</p>
      </Seccion>

      <Seccion titulo="4. Dónde se almacenan">
        <p>
          Usamos proveedores de infraestructura que actúan como encargados del
          tratamiento: Supabase (base de datos y autenticación) y Vercel
          (alojamiento web). El contacto por WhatsApp se rige por los términos
          y la privacidad de WhatsApp.
        </p>
      </Seccion>

      <Seccion titulo="5. Tus derechos">
        <p>
          Puedes solicitar el acceso, rectificación, cancelación u oposición
          (derechos ARCO) sobre tus datos, así como la eliminación de tu
          cuenta, escribiendo a{" "}
          <a
            className="text-action-primary underline"
            href="mailto:motoresenmarcha2026@gmail.com"
          >
            motoresenmarcha2026@gmail.com
          </a>
          .
        </p>
      </Seccion>

      <Seccion titulo="6. Cambios a este aviso">
        <p>
          Publicaremos cualquier cambio en esta página indicando la fecha de
          última actualización.
        </p>
      </Seccion>
    </>
  );
}
