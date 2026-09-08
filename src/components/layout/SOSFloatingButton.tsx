import Link from "next/link";
import { Siren } from "lucide-react";

/**
 * Sello rojo sobreimpreso: la acción de emergencia, **siempre visible**.
 *
 * No se oculta nunca, ni siquiera cuando hay otro CTA de emergencia en
 * pantalla: un camino de emergencia que desaparece solo deja de ser un camino
 * de emergencia, y la escena confirmada del producto es un conductor varado
 * con el celular en una mano. Los controles que caerían debajo esquivan
 * `--zona-sos` en vez de que el sello se aparte.
 *
 * Se separa del contenido con filete de tinta, no con sombra: la sombra dura
 * sin desenfoque es un device neobrutalista que este mundo no usa. El
 * movimiento vive en el empuje al presionar.
 */
export function SOSFloatingButton() {
  return (
    <Link
      href="/solicitar?prioridad=emergencia"
      aria-label="Solicitar ayuda de emergencia"
      className="banderin group fixed bottom-5 right-5 z-40 inline-flex h-14 items-center gap-sm rounded-none border-2 border-border-primary bg-emergency px-lg pr-xl font-heading text-base font-extrabold uppercase tracking-[0.08em] text-foreground-inverse transition-[transform,background-color] duration-150 ease-press hover:bg-emergency-dark active:translate-x-[2px]"
    >
      <Siren size={24} aria-hidden />
      <span className="hidden sm:inline">SOS Emergencia</span>
    </Link>
  );
}
