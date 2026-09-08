import Link from "next/link";
import Image from "next/image";

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
      { href: "mailto:motoresenmarcha2026@gmail.com", label: "Contacto" },
    ],
  },
  {
    titulo: "Legal",
    links: [
      { href: "/terminos", label: "Términos y condiciones" },
      { href: "/privacidad", label: "Aviso de privacidad" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

/** Plancha de cierre: tinta plena con la cuña roja al pie de la línea. */
export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t-[3px] border-emergency bg-surface-inverse text-foreground-inverse-secondary">
      <span aria-hidden className="trama-papel pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-lg px-md py-2xl md:grid-cols-4 md:px-lg">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-sm">
            <Image src="/logo.png" alt="" width={36} height={36} className="shrink-0" />
            <span className="font-heading text-base font-extrabold uppercase tracking-[0.04em] text-foreground-inverse">
              Motores en Marcha
            </span>
          </div>
          <span
            aria-hidden
            className="mt-sm block h-[3px] w-24 bg-emergency"
            style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
          />
          <p className="mt-md max-w-[20rem] font-body text-sm leading-relaxed">
            Ayuda mecánica confiable, a un mensaje de WhatsApp de distancia.
            Conectamos conductores con mecánicos y talleres de confianza.
          </p>
        </div>

        {COLUMNAS.map((col) => (
          <div key={col.titulo}>
            <h3 className="font-heading text-sm font-extrabold uppercase tracking-[0.14em] text-foreground-inverse">
              {col.titulo}
            </h3>
            <ul className="mt-xs flex flex-col">
              {col.links.map((link, i) => (
                <li key={`${link.label}-${i}`}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center font-body text-sm underline-offset-4 transition-colors hover:text-foreground-inverse hover:underline hover:decoration-emergency hover:decoration-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative border-t border-white/15">
        <div className="mx-auto max-w-7xl px-md py-md md:px-lg">
          <p className="cifras font-body text-xs uppercase tracking-[0.08em]">
            © 2026 Motores en Marcha. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
