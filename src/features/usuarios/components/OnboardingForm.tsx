"use client";

import { useActionState, useState } from "react";
import { Car, Wrench, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ESPECIALIDADES } from "@/features/talleres/mock";
import type { Especialidad } from "@/features/talleres/types";
import { CATEGORIAS_REFACCION } from "@/features/refacciones/mock";
import { completarPerfil } from "@/features/usuarios/actions";

type Rol = "conductor" | "taller" | "vendedor";

/** Onboarding tras entrar con Google: elegir tipo de cuenta y completar datos. */
export function OnboardingForm({ nombreSugerido }: { nombreSugerido: string }) {
  const [state, action, pending] = useActionState(completarPerfil, undefined);
  const [rol, setRol] = useState<Rol | null>(null);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);

  function toggle(e: Especialidad) {
    setEspecialidades((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  }

  function toggleCategoria(c: string) {
    setCategorias((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  const requiereNegocio = rol === "taller" || rol === "vendedor";

  return (
    <main className="flex flex-1 items-center justify-center bg-surface-page px-md py-2xl">
      <div className="w-full max-w-[34rem]">
        <div className="mb-lg text-center">
          <h1 className="font-heading text-4xl font-extrabold uppercase leading-none text-foreground-primary md:text-5xl">
            Un paso más
          </h1>
          <p className="mt-xs font-body text-foreground-secondary">
            Cuéntanos cómo usarás Motores en Marcha para terminar tu cuenta.
          </p>
        </div>

        {/* Selector de tipo */}
        <div className="grid grid-cols-3 gap-sm">
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
          <TarjetaRol
            activo={rol === "vendedor"}
            onClick={() => setRol("vendedor")}
            icono={<Package size={24} />}
            titulo="Soy vendedor"
            desc="Vendo refacciones"
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
              <FormField label="Ciudad" htmlFor="ciudad" required={requiereNegocio}>
                <Input id="ciudad" name="ciudad" placeholder="Ciudad de México" required={requiereNegocio} />
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
                            "inline-flex h-11 items-center rounded-none border-2 px-md font-heading text-xs font-extrabold uppercase tracking-[0.1em] transition-colors",
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

            {rol === "vendedor" && (
              <>
                <FormField label="Nombre del negocio" htmlFor="negocio_nombre" required>
                  <Input id="negocio_nombre" name="negocio_nombre" placeholder="Ej. Refaccionaria El Pistón" required />
                </FormField>
                <FormField label="Dirección" htmlFor="direccion" required>
                  <Textarea id="direccion" name="direccion" placeholder="Calle, número, colonia, referencias…" required />
                </FormField>
                <FormField label="Categorías que vendes" required>
                  <div className="flex flex-wrap gap-xs">
                    {CATEGORIAS_REFACCION.map((c) => {
                      const activo = categorias.includes(c.key);
                      return (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => toggleCategoria(c.key)}
                          className={cn(
                            "inline-flex h-11 items-center rounded-none border-2 px-md font-heading text-xs font-extrabold uppercase tracking-[0.1em] transition-colors",
                            activo
                              ? "border-action-primary bg-action-primary text-foreground-inverse"
                              : "border-border-subtle bg-surface-card text-foreground-secondary hover:border-foreground-secondary"
                          )}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </FormField>
                {categorias.map((c) => (
                  <input key={c} type="hidden" name="categorias" value={c} />
                ))}
              </>
            )}

            {state?.error && (
              <p className="border-2 border-emergency-dark bg-surface-card px-md py-2.5 font-body text-sm font-semibold text-emergency-dark">
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
        "flex flex-col items-center gap-xs rounded-none border-2 bg-surface-card p-lg text-center transition-colors",
        activo
          ? "border-action-primary"
          : "border-border-subtle hover:border-foreground-secondary"
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-none border-2 border-border-primary",
          activo ? "bg-action-primary text-foreground-inverse" : "bg-black/5 text-foreground-secondary"
        )}
      >
        {icono}
      </span>
      <span className="font-heading text-base font-bold text-foreground-primary">{titulo}</span>
      <span className="font-body text-xs text-foreground-secondary">{desc}</span>
    </button>
  );
}
