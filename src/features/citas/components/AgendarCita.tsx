"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FormField, Textarea } from "@/components/ui/FormField";
import { FRANJAS_HORARIAS } from "../mock";
import { especialidadMeta } from "@/features/talleres/mock";
import type { Taller } from "@/features/talleres/types";

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Formulario para agendar una cita con un taller. */
export function AgendarCita({ taller }: { taller: Taller }) {
  const router = useRouter();

  // Próximos 14 días (runtime del cliente).
  const dias = useMemo(() => {
    const hoy = new Date();
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      return d;
    });
  }, []);

  const [servicio, setServicio] = useState(taller.especialidades[0]);
  const [diaSel, setDiaSel] = useState(0);
  const [hora, setHora] = useState<string | null>(null);
  const [comentario, setComentario] = useState("");

  const listo = hora !== null;

  function confirmar() {
    // TODO: conectar a Supabase — insertar cita en la tabla `citas`.
    router.push("/confirmacion?tipo=solicitud");
  }

  const fecha = dias[diaSel];

  return (
    <div className="grid gap-xl lg:grid-cols-[1fr_340px]">
      {/* Selección */}
      <div className="flex flex-col gap-xl">
        {/* Servicio */}
        <fieldset className="flex flex-col gap-sm">
          <legend className="font-heading text-lg font-bold text-foreground-primary">
            ¿Qué servicio necesitas?
          </legend>
          <div className="flex flex-wrap gap-xs">
            {taller.especialidades.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setServicio(e)}
                className={cn(
                  "rounded-full border px-md py-1.5 font-caption text-sm font-medium transition-colors",
                  servicio === e
                    ? "border-action-primary bg-action-primary text-foreground-inverse"
                    : "border-border-subtle bg-surface-card text-foreground-secondary hover:border-foreground-secondary"
                )}
              >
                {especialidadMeta(e).label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Fecha */}
        <fieldset className="flex flex-col gap-sm">
          <legend className="font-heading text-lg font-bold text-foreground-primary">
            Elige la fecha
          </legend>
          <div className="grid grid-cols-4 gap-xs sm:grid-cols-7">
            {dias.map((d, i) => {
              const activo = i === diaSel;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDiaSel(i)}
                  className={cn(
                    "flex flex-col items-center rounded-xl border p-sm transition-colors",
                    activo
                      ? "border-action-primary bg-action-primary text-foreground-inverse"
                      : "border-border-subtle bg-surface-card hover:border-foreground-secondary"
                  )}
                >
                  <span className="font-caption text-xs opacity-80">
                    {DIAS_SEMANA[d.getDay()]}
                  </span>
                  <span className="font-data text-lg font-bold">
                    {d.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Hora */}
        <fieldset className="flex flex-col gap-sm">
          <legend className="font-heading text-lg font-bold text-foreground-primary">
            Elige la hora
          </legend>
          <div className="grid grid-cols-3 gap-xs sm:grid-cols-4">
            {FRANJAS_HORARIAS.map((f) => (
              <button
                key={f.hora}
                type="button"
                disabled={!f.disponible}
                onClick={() => setHora(f.hora)}
                className={cn(
                  "rounded-lg border px-sm py-2.5 font-data text-sm font-semibold transition-colors",
                  !f.disponible &&
                    "cursor-not-allowed border-border-subtle bg-surface-page text-border-subtle line-through",
                  f.disponible && hora === f.hora
                    ? "border-action-primary bg-action-primary text-foreground-inverse"
                    : f.disponible &&
                        "border-border-subtle bg-surface-card text-foreground-primary hover:border-foreground-secondary"
                )}
              >
                {f.hora}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Comentario */}
        <FormField label="Comentario (opcional)" htmlFor="comentario">
          <Textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Agrega detalles que el taller deba saber…"
          />
        </FormField>
      </div>

      {/* Resumen */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-col gap-md rounded-2xl border border-border-subtle bg-surface-card p-lg">
          <h2 className="font-heading text-lg font-bold text-foreground-primary">
            Resumen de la cita
          </h2>
          <dl className="flex flex-col gap-sm font-caption text-sm">
            <Fila label="Taller" valor={taller.nombre} />
            <Fila label="Servicio" valor={especialidadMeta(servicio).label} />
            <Fila
              label="Fecha"
              valor={`${fecha.getDate()} de ${MESES[fecha.getMonth()]}`}
            />
            <Fila label="Hora" valor={hora ?? "Sin seleccionar"} />
          </dl>

          <div className="flex items-start gap-sm rounded-lg bg-status-available/10 p-sm">
            <Check size={18} className="mt-0.5 shrink-0 text-status-available" />
            <p className="font-caption text-xs text-foreground-secondary">
              El taller confirmará tu cita y podrás coordinar por WhatsApp.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!listo}
            onClick={confirmar}
          >
            <Calendar size={18} /> Confirmar cita
          </Button>
        </div>
      </aside>
    </div>
  );
}

function Fila({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between gap-md">
      <dt className="text-foreground-secondary">{label}</dt>
      <dd className="text-right font-semibold text-foreground-primary">
        {valor}
      </dd>
    </div>
  );
}
