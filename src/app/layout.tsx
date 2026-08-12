import type { Metadata } from "next";
import { Funnel_Sans, Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Headings
const funnelSans = Funnel_Sans({
  variable: "--font-funnel",
  subsets: ["latin"],
});

// Body
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Caption
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// Datos / monoespaciada (precios, ETA, tiempos)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Motores en Marcha — Ayuda mecánica confiable",
  description:
    "Marketplace que conecta conductores con mecánicos y talleres. Ayuda mecánica rápida y de emergencia, a un mensaje de WhatsApp de distancia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${funnelSans.variable} ${inter.variable} ${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-page text-foreground-primary font-body">
        {children}
      </body>
    </html>
  );
}
