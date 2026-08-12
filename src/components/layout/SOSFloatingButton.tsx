import Link from "next/link";
import { Siren } from "lucide-react";

/**
 * Botón flotante de emergencia (SOS). Siempre visible en las vistas del
 * conductor. Lleva al flujo de solicitud con prioridad de emergencia.
 */
export function SOSFloatingButton() {
  return (
    <Link
      href="/solicitar?prioridad=emergencia"
      aria-label="Solicitar ayuda de emergencia"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-sm rounded-full bg-emergency px-lg py-3 font-heading font-bold text-foreground-inverse shadow-lg shadow-emergency/30 transition-all hover:bg-emergency-dark hover:shadow-xl"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-emergency opacity-40 group-hover:opacity-0" />
      <Siren size={22} />
      <span className="hidden sm:inline">SOS Emergencia</span>
    </Link>
  );
}
