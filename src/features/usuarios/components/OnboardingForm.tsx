"use client";

import { useActionState, useState } from "react";
import { Car, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ESPECIALIDADES } from "@/features/talleres/mock";
import type { Especialidad } from "@/features/talleres/types";
import { completarPerfil } from "@/features/usuarios/actions";

type Rol = "conductor" | "taller";

/** Onboarding tras entrar con Google: elegir tipo de cuenta y completar datos. */
export function OnboardingForm({ nombreSugerido }: { nombreSugerido: string }) {
  const [state, action, pending] = useActionState(completarPerfil, undefined);
  const [rol, setRol] = useState<Rol | null>(null);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);

  function toggle(e: Especialidad) {
    setEspecialidades((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-surface-page px-md py-2xl">
      <div className="w-full max-w-[34rem]">
        <div className="mb-lg text-center">
          <h1 className="font-heading text-3xl font-extrabold text-foreground-primary">
            Un paso más
          </h1>
          <p className="mt-xs font-body text-foreground-secondary">
            Cuéntanos cómo usarás Motores en Marcha para terminar tu cuenta.
          </p>
        </div>

        {/* Selector de tipo */}
        <div className="grid grid-cols-2 gap-md">
          <TarjetaRol
            activo={rol === "conductor"}
            onClick={() => setRol("conductor")}
            icono={<Car size={24} />}
            titulo="Soy conductor"
            desc="Busco ayuda mecánica"
          />
          <TarjetaRol
            activo={rol === "taller"}
            onClick={() => setRol("taller")}
            icono={<Wrench size={24} />}
            titulo="Soy taller"
            desc="Ofrezco servicios"
          />
        </div>

        {rol && (
          <form action={action} className="mt-lg flex flex-col gap-md">
            <input type="hidden" name="rol" value={rol} />

            <FormField label="Nombre completo" htmlFor="nombre" required>
              <Input id="nombre" name="nombre" defaultValue={nombreSugerido} placeholder="Tu nombre" required />
            </FormField>
            <div className="grid gap-md sm:grid-cols-2">
              <FormField label="Teléfono / WhatsApp" htmlFor="telefono" required>
                <Input id="telefono" name="telefono" type="tel" placeholder="+52 55 1234 5678" required />
              </FormField>
              <FormField label="Ciudad" htmlFor="ciudad" required={rol === "taller"}>
                <Input id="ciudad" name="ciudad" placeholder="Ciudad de México" required={rol === "taller"} />
              </FormField>
            </div>

            {rol === "taller" && (
              <>
                <FormField label="Nombre del taller" htmlFor="taller_nombre" required>
                  <Input id="taller_nombre" name="taller_nombre" placeholder="Ej. Taller El Rápido" required />
                </FormField>
                <FormField label="Dirección" htmlFor="direccion" required>
                  <Textarea id="direccion" name="direccion" placeholder="Calle, número, colonia, referencias…" required />
                </FormField>
                <FormField label="Servicios que ofreces" required>
                  <div className="flex flex-wrap gap-xs">
                    {ESPECIALIDADES.map((e) => {
                      const activo = especialidades.includes(e.key);
                      return (
                        <button
                          key={e.key}
                          type="button"
                          onClick={() => toggle(e.key)}
                          className={cn(
                            "rounded-full border px-md py-1.5 font-caption text-sm font-medium transition-colors",
                            activo
                              ? "border-action-primary bg-action-primary text-foreground-inverse"
                              : "border-border-subtle bg-surface-card text-foreground-secondary hover:border-foreground-secondary"
                          )}
                        >
                          {e.label}
                        </button>
                      );
                    })}
                  </div>
                </FormField>
                {especialidades.map((e) => (
                  <input key={e} type="hidden" name="especialidades" value={e} />
                ))}
              </>
            )}

            {state?.error && (
              <p className="rounded-lg bg-emergency/10 px-md py-2.5 font-caption text-sm text-emergency">
                {state.error}
              </p>
            )}

            <Button
              type="submit"
              variant={rol === "taller" ? "emergency" : "primary"}
              size="lg"
              fullWidth
              disabled={pending}
            >
              {pending ? "Guardando…" : "Terminar de crear mi cuenta"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}

function TarjetaRol({
  activo,
  onClick,
  icono,
  titulo,
  desc,
}: {
  activo: boolean;
  onClick: () => void;
  icono: React.ReactNode;
  titulo: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-xs rounded-2xl border-2 bg-surface-card p-lg text-center transition-colors",
        activo
          ? "border-action-primary"
          : "border-border-subtle hover:border-foreground-secondary"
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          activo ? "bg-action-primary text-foreground-inverse" : "bg-black/5 text-foreground-secondary"
        )}
      >
        {icono}
      </span>
      <span className="font-heading text-base font-bold text-foreground-primary">{titulo}</span>
      <span className="font-caption text-xs text-foreground-secondary">{desc}</span>
    </button>
  );
}
