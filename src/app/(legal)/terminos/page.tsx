import type { Metadata } from "next";
import { TituloLegal, Seccion } from "../legal-ui";

export const metadata: Metadata = {
  title: "Términos y condiciones — Motores en Marcha",
  description:
    "Términos y condiciones de uso de la plataforma Motores en Marcha.",
};

export default function TerminosPage() {
  return (
    <>
      <TituloLegal actualizado="14 de agosto de 2026">
        Términos y condiciones
      </TituloLegal>

      <Seccion titulo="1. Qué es Motores en Marcha">
        <p>
          Motores en Marcha (&ldquo;la Plataforma&rdquo;) es un servicio en
          línea que conecta a conductores con mecánicos y talleres
          independientes (&ldquo;Talleres&rdquo;). La Plataforma facilita el
          contacto, la solicitud de servicios y el agendamiento de citas;{" "}
          <strong>
            no presta servicios mecánicos ni es parte de la relación comercial
          </strong>{" "}
          entre el conductor y el Taller.
        </p>
      </Seccion>

      <Seccion titulo="2. Aceptación">
        <p>
          Al crear una cuenta o utilizar la Plataforma aceptas estos términos y
          el aviso de privacidad. Si no estás de acuerdo, no utilices la
          Plataforma.
        </p>
      </Seccion>

      <Seccion titulo="3. Cuentas">
        <ul>
          <li>
            Debes proporcionar información veraz y mantenerla actualizada.
          </li>
          <li>
            Eres responsable de la confidencialidad de tu contraseña y de la
            actividad realizada desde tu cuenta.
          </li>
          <li>
            Los Talleres son responsables de la exactitud de la información de
            su perfil (especialidades, horarios, precios y fotografías).
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="4. Servicios y pagos">
        <p>
          Los precios, presupuestos, tiempos y garantías de los servicios
          mecánicos son acordados directamente entre el conductor y el Taller,
          normalmente a través de WhatsApp. La Plataforma no procesa pagos ni
          interviene en dichos acuerdos.
        </p>
      </Seccion>

      <Seccion titulo="5. Reseñas">
        <p>
          Las reseñas deben ser honestas y basadas en experiencias reales. Nos
          reservamos el derecho de retirar contenido ofensivo, falso o que
          infrinja derechos de terceros.
        </p>
      </Seccion>

      <Seccion titulo="6. Limitación de responsabilidad">
        <p>
          La Plataforma se ofrece &ldquo;tal cual&rdquo;. En la máxima medida
          permitida por la ley, Motores en Marcha no es responsable por la
          calidad, seguridad o resultado de los servicios prestados por los
          Talleres, ni por daños derivados del uso de la Plataforma.
        </p>
      </Seccion>

      <Seccion titulo="7. Cambios">
        <p>
          Podemos actualizar estos términos en cualquier momento. Los cambios
          se publicarán en esta página con la fecha de actualización.
        </p>
      </Seccion>

      <Seccion titulo="8. Contacto">
        <p>
          Para dudas sobre estos términos escríbenos a{" "}
          <a
            className="text-action-primary underline"
            href="mailto:motoresenmarcha2026@gmail.com"
          >
            motoresenmarcha2026@gmail.com
          </a>
          .
        </p>
      </Seccion>
    </>
  );
}
