"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/FormField";
import { EstrellasCalificacion } from "./EstrellasCalificacion";
import { enviarResena } from "../actions";

const DESTACADOS = [
  "Rápido",
  "Profesional",
  "Buen precio",
  "Puntual",
  "Limpio",
  "Buena comunicación",
];

const TEXTO_RATING = ["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"];

/** Formulario de calificación de un servicio. */
export function FormularioCalificacion({
  tallerId,
  servicio,
}: {
  tallerId: string;
  servicio?: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(t: string) {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  async function enviar() {
    if (rating === 0 || enviando) return;
    setEnviando(true);
    setError(null);

    const res = await enviarResena({ tallerId, rating, comentario, servicio, tags });
    if (res.error) {
      setError(res.error);
      setEnviando(false);
      return;
    }
    router.push("/citas/mis-citas");
  }

  return (
    <div className="flex flex-col gap-lg rounded-2xl border border-border-subtle bg-surface-card p-lg">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground-primary">
          ¿Cómo estuvo tu servicio?
        </h2>
        <p className="font-body text-sm text-foreground-secondary">
          Tu opinión ayuda a otros conductores a elegir mejor.
        </p>
      </div>

      {/* Estrellas */}
      <div className="flex flex-col items-center gap-sm">
        <EstrellasCalificacion valor={rating} onChange={setRating} />
        <span className="font-caption text-sm font-semibold text-foreground-secondary">
          {TEXTO_RATING[rating] || "Toca para calificar"}
        </span>
      </div>

      {/* Destacados */}
      <div>
        <p className="mb-sm font-caption text-sm font-semibold text-foreground-primary">
          ¿Qué destacarías?
        </p>
        <div className="flex flex-wrap gap-xs">
          {DESTACADOS.map((t) => {
            const activo = tags.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggle(t)}
                className={cn(
                  "rounded-full border px-md py-1.5 font-caption text-sm font-medium transition-colors",
                  activo
                    ? "border-action-primary bg-action-primary text-foreground-inverse"
                    : "border-border-subtle bg-surface-card text-foreground-secondary hover:border-foreground-secondary"
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comentario */}
      <Textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Cuéntanos cómo fue tu experiencia (opcional)…"
      />

      {error && (
        <p className="rounded-lg bg-emergency/10 px-md py-2.5 font-caption text-sm text-emergency">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-sm sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={rating === 0 || enviando}
          onClick={enviar}
        >
          {enviando ? "Enviando…" : "Enviar calificación"}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => router.push("/citas/mis-citas")}
        >
          Saltar
        </Button>
      </div>
    </div>
  );
}
