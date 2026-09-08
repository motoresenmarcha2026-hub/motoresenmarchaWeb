import type { Metadata } from "next";
import { Big_Shoulders, Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

/**
 * Dos familias, no cuatro.
 * Versales de plantilla para el registro de cartel (títulos, cifras a escala)
 * y grotesca de tabla para todo lo que se lee y se mide.
 */
const stencil = Big_Shoulders({
  variable: "--font-stencil",
  subsets: ["latin"],
  // Next no tiene métricas de respaldo para esta cara; sin una pila explícita
  // el título salta de tamaño al cargar la fuente.
  fallback: ["Arial Narrow", "Helvetica Neue", "Arial", "sans-serif"],
});

const grotesk = Archivo({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.motoresenmarcha.com"),
  title: "Motores en Marcha — Ayuda mecánica confiable",
  description:
    "Marketplace que conecta conductores con mecánicos y talleres. Ayuda mecánica rápida y de emergencia, a un mensaje de WhatsApp de distancia.",
  openGraph: {
    // og.jpg en vez de logo.png: la imagen de OpenGraph se sirve cruda a los
    // rastreadores (WhatsApp, redes) sin pasar por next/image. 1538 KB -> 212 KB.
    images: [{ url: "/og.jpg", width: 1200, height: 1200 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${stencil.variable} ${grotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-page text-foreground-primary font-body">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
