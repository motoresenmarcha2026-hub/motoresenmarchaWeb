import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-page">
        <div className="mx-auto max-w-3xl px-md py-2xl md:px-lg">{children}</div>
      </main>
      <Footer />
    </>
  );
}
