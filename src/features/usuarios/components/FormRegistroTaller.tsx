"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ESPECIALIDADES } from "@/features/talleres/mock";
import type { Especialidad } from "@/features/talleres/types";
import { registrarTaller } from "@/features/usuarios/actions";
import { BotonGoogle, SeparadorO } from "./BotonGoogle";

/** Formulario de registro de taller/mecánico (Supabase Auth). */
export function FormRegistroTaller() {
  const [state, action, pending] = useActionState(registrarTaller, undefined);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);

  function toggle(e: Especialidad) {
    setEspecialidades((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  }

  return (
    <div className="flex flex-col gap-md">
      <form action={action} className="flex flex-col gap-md">
        <div className="grid gap-md sm:grid-cols-2">
          <FormField label="Nombre del taller" htmlFor="taller_nombre" required>
            <Input id="taller_nombre" name="taller_nombre" placeholder="Ej. Taller El Rápido" required />
          </FormField>
          <FormField label="Nombre del contacto" htmlFor="nombre" required>
            <Input id="nombre" name="nombre" placeholder="Ej. Carlos Medina" required />
          </FormField>
          <FormField label="Correo electrónico" htmlFor="email" required>
            <Input id="email" name="email" type="email" placeholder="taller@ejemplo.mx" required />
          </FormField>
          <FormField label="Teléfono / WhatsApp" htmlFor="telefono" required>
            <Input id="telefono" name="telefono" type="tel" placeholder="+52 55 1234 5678" required />
          </FormField>
          <FormField label="Ciudad" htmlFor="ciudad" required>
            <Input id="ciudad" name="ciudad" placeholder="Ciudad de México" required />
          </FormField>
          <FormField label="Contraseña" htmlFor="password" required hint="Mínimo 8 caracteres.">
            <Input id="password" name="password" type="password" placeholder="••••••••" minLength={8} required />
          </FormField>
          <FormField label="Dirección" htmlFor="direccion" required className="sm:col-span-2">
            <Textarea id="direccion" name="direccion" placeholder="Calle, número, colonia, referencias…" required />
          </FormField>
        </div>

        {/* Especialidades: chips visibles + inputs ocultos para el submit */}
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

        <label className="flex cursor-pointer items-start gap-sm py-xs font-caption text-sm text-foreground-secondary">
          <input type="checkbox" required className="mt-0.5 h-5 w-5 shrink-0 accent-action-primary" />
          <span>
            Acepto los{" "}
            <Link href="/terminos" target="_blank" className="text-action-primary underline">
              términos y condiciones
            </Link>{" "}
            y el{" "}
            <Link href="/privacidad" target="_blank" className="text-action-primary underline">
              aviso de privacidad
            </Link>
            .
          </span>
        </label>

        {state?.error && (
          <p className="rounded-lg bg-emergency/10 px-md py-2.5 font-caption text-sm text-emergency">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="emergency" size="lg" fullWidth disabled={pending}>
          {pending ? "Creando cuenta…" : "Crear cuenta de taller"}
        </Button>
      </form>

      <SeparadorO />
      <BotonGoogle label="Registrarme con Google" />
    </div>
  );
}
