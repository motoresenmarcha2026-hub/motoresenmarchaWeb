import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/** Layout compartido de páginas legales: contenedor de lectura angosto. */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-[48rem] px-md py-2xl md:px-lg">
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
