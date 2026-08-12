import { CategoryCard } from "@/components/ui/CategoryCard";
import { TIPOS_PROBLEMA } from "../mock";
import type { TipoProblema } from "../types";

/** Grid selector del tipo de problema mecánico. */
export function SelectorTipoProblema({
  valor,
  onChange,
}: {
  valor: TipoProblema | null;
  onChange: (t: TipoProblema) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-sm sm:grid-cols-3 lg:grid-cols-5">
      {TIPOS_PROBLEMA.map((t) => (
        <CategoryCard
          key={t.key}
          icono={t.icono}
          label={t.label}
          seleccionado={valor === t.key}
          onClick={() => onChange(t.key)}
        />
      ))}
    </div>
  );
}
