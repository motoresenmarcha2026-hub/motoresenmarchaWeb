import type { Metadata } from "next";
import { TituloLegal, Seccion } from "../legal-ui";

export const metadata: Metadata = {
  title: "Política de cookies — Motores en Marcha",
  description:
    "Qué cookies usa Motores en Marcha y para qué sirven.",
};

export default function CookiesPage() {
  return (
    <>
      <TituloLegal actualizado="14 de agosto de 2026">
        Política de cookies
      </TituloLegal>

      <Seccion titulo="1. Qué son las cookies">
        <p>
          Las cookies son pequeños archivos que el navegador guarda para que un
          sitio funcione correctamente o recuerde información entre visitas.
        </p>
      </Seccion>

      <Seccion titulo="2. Cookies que usamos">
        <ul>
          <li>
            <strong>Cookies de sesión (esenciales):</strong> mantienen tu
            sesión iniciada de forma segura (autenticación de Supabase). Sin
            ellas no es posible iniciar sesión.
          </li>
        </ul>
        <p>
          No usamos cookies de publicidad ni de rastreo de terceros.
        </p>
      </Seccion>

      <Seccion titulo="3. Cómo controlarlas">
        <p>
          Puedes borrar o bloquear las cookies desde la configuración de tu
          navegador. Ten en cuenta que al bloquear las cookies esenciales no
          podrás iniciar sesión en la plataforma.
        </p>
      </Seccion>

      <Seccion titulo="4. Contacto">
        <p>
          ¿Dudas sobre esta política? Escríbenos a{" "}
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
