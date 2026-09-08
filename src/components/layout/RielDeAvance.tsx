"use client";

import * as React from "react";

/**
 * El momento firmado: la cuña roja recorre el viewport ligada al scroll.
 *
 * No es una barra de progreso que se llena — es la locomotora avanzando por
 * la línea, que es el device del propio mundo. Se mueve con rAF sobre una
 * variable CSS y no con `animation-timeline: scroll()`, que no existe en
 * Safari, o sea no existe en el celular del conductor varado.
 *
 * Sin vía de fondo: este mundo separa con reglas de tinta, no con bandas
 * grises translúcidas.
 */
export function RielDeAvance() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pendiente = 0;

    const pintar = () => {
      pendiente = 0;
      const el = ref.current;
      if (!el) return;
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      const avance = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0;
      el.style.setProperty("--avance", String(avance));
    };

    const alScroll = () => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(pintar);
    };

    pintar();
    if (reducido.matches) return;

    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      if (pendiente) cancelAnimationFrame(pendiente);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-[4.75rem] z-30 h-[7px] overflow-hidden"
    >
      <span
        className="locomotora block h-full w-28 bg-emergency"
        style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)" }}
      />
    </div>
  );
}
