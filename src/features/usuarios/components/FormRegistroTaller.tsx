"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ESPECIALIDADES } from "@/features/talleres/mock";
import type { Especialidad } from "@/features/talleres/types";

/** Formulario de registro de taller/mecánico (mock, sin backend). */
export function FormRegistroTaller() {
  const router = useRouter();
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);

  function toggle(e: Especialidad) {
    setEspecialidades((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    // TODO: conectar a Supabase Auth — crear cuenta de taller + perfil.
    router.push("/confirmacion?tipo=taller");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-md">
      <div className="grid gap-md sm:grid-cols-2">
        <FormField label="Nombre del taller" htmlFor="taller" required>
          <Input id="taller" placeholder="Ej. Taller El Rápido" required />
        </FormField>
        <FormField label="Nombre del contacto" htmlFor="contacto" required>
          <Input id="contacto" placeholder="Ej. Carlos Medina" required />
        </FormField>
        <FormField label="Correo electrónico" htmlFor="email" required>
          <Input id="email" type="email" placeholder="taller@ejemplo.mx" required />
        </FormField>
        <FormField label="Teléfono / WhatsApp" htmlFor="tel" required>
          <Input id="tel" type="tel" placeholder="+52 55 1234 5678" required />
        </FormField>
        <FormField label="Ciudad" htmlFor="ciudad" required>
          <Input id="ciudad" placeholder="Ciudad de México" required />
        </FormField>
        <FormField label="Contraseña" htmlFor="pass" required>
          <Input id="pass" type="password" placeholder="••••••••" required />
        </FormField>
        <FormField label="Dirección" htmlFor="dir" required className="sm:col-span-2">
          <Textarea id="dir" placeholder="Calle, número, colonia, referencias…" required />
        </FormField>
      </div>

      {/* Especialidades */}
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

      <label className="flex items-start gap-sm font-caption text-sm text-foreground-secondary">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-action-primary" />
        Acepto los términos y condiciones y el aviso de privacidad.
      </label>

      <Button type="submit" variant="emergency" size="lg" fullWidth>
        Crear cuenta de taller
      </Button>
    </form>
  );
}
