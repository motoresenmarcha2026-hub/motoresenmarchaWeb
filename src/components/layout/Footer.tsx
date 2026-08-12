import Link from "next/link";
import { Wrench } from "lucide-react";

const COLUMNAS = [
  {
    titulo: "Servicios",
    links: [
      { href: "/talleres", label: "Buscar mecánicos" },
      { href: "/solicitar", label: "Solicitar ayuda" },
      { href: "/solicitar", label: "Emergencia SOS" },
      { href: "/talleres", label: "Talleres cercanos" },
    ],
  },
  {
    titulo: "Compañía",
    links: [
      { href: "/#como-funciona", label: "Cómo funciona" },
      { href: "/registro/taller", label: "Únete como taller" },
      { href: "#", label: "Sobre nosotros" },
      { href: "#", label: "Contacto" },
    ],
  },
  {
    titulo: "Legal",
    links: [
      { href: "#", label: "Términos y condiciones" },
      { href: "#", label: "Aviso de privacidad" },
      { href: "#", label: "Cookies" },
    ],
  },
];

/** Footer principal (oscuro, columnas). */
export function Footer() {
  return (
    <footer className="mt-auto bg-surface-inverse text-foreground-inverse-secondary">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-lg px-md py-2xl md:grid-cols-4 md:px-lg">
        {/* Marca */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emergency text-foreground-inverse">
              <Wrench size={18} />
            </span>
            <span className="font-heading text-base font-extrabold uppercase text-foreground-inverse">
              Motores en Marcha
            </span>
          </div>
          <p className="mt-md max-w-[20rem] font-caption text-sm">
            Ayuda mecánica confiable, a un mensaje de WhatsApp de distancia.
            Conectamos conductores con mecánicos y talleres de confianza.
          </p>
        </div>

        {/* Columnas de enlaces */}
        {COLUMNAS.map((col) => (
          <div key={col.titulo}>
            <h3 className="font-caption text-sm font-semibold uppercase tracking-wide text-foreground-inverse">
              {col.titulo}
            </h3>
            <ul className="mt-md flex flex-col gap-sm">
              {col.links.map((link, i) => (
                <li key={`${link.label}-${i}`}>
                  <Link
                    href={link.href}
                    className="font-body text-sm transition-colors hover:text-foreground-inverse"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-md py-md md:px-lg">
          <p className="font-caption text-xs">
            © 2026 Motores en Marcha. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
