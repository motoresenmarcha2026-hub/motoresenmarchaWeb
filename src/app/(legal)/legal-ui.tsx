/** Piezas tipográficas compartidas por las páginas legales. */

export function TituloLegal({
  children,
  actualizado,
}: {
  children: React.ReactNode;
  actualizado: string;
}) {
  return (
    <header className="mb-xl">
      <h1 className="font-heading text-3xl font-extrabold text-foreground-primary md:text-4xl">
        {children}
      </h1>
      <p className="mt-xs font-caption text-sm text-foreground-secondary">
        Última actualización: {actualizado}
      </p>
    </header>
  );
}

export function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-lg">
      <h2 className="mb-sm font-heading text-xl font-bold text-foreground-primary">
        {titulo}
      </h2>
      <div className="flex flex-col gap-sm font-body text-foreground-secondary [&_li]:ml-lg [&_li]:list-disc">
        {children}
      </div>
    </section>
  );
}
