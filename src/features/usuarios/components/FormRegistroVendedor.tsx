"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { CATEGORIAS_REFACCION } from "@/features/refacciones/mock";
import { registrarVendedor } from "@/features/usuarios/actions";
import { BotonGoogle, SeparadorO } from "./BotonGoogle";

/** Formulario de registro de vendedor de refacciones (Supabase Auth). */
export function FormRegistroVendedor() {
  const [state, action, pending] = useActionState(registrarVendedor, undefined);
  const [categorias, setCategorias] = useState<string[]>([]);

  function toggle(c: string) {
    setCategorias((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  return (
    <div className="flex flex-col gap-md">
      <form action={action} className="flex flex-col gap-md">
        <div className="grid gap-md sm:grid-cols-2">
          <FormField label="Nombre del negocio" htmlFor="negocio_nombre" required>
            <Input id="negocio_nombre" name="negocio_nombre" placeholder="Ej. Refaccionaria El Pistón" required />
          </FormField>
          <FormField label="Nombre del contacto" htmlFor="nombre" required>
            <Input id="nombre" name="nombre" placeholder="Ej. Laura Ríos" required />
          </FormField>
          <FormField label="Correo electrónico" htmlFor="email" required>
            <Input id="email" name="email" type="email" placeholder="negocio@ejemplo.mx" required />
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

        {/* Categorías: chips visibles + inputs ocultos para el submit */}
        <FormField label="Categorías que vendes" required>
          <div className="flex flex-wrap gap-xs">
            {CATEGORIAS_REFACCION.map((c) => {
              const activo = categorias.includes(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => toggle(c.key)}
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

        <label className="flex cursor-pointer items-start gap-sm py-xs font-body text-sm text-foreground-secondary">
          <input type="checkbox" required className="mt-0.5 h-5 w-5 shrink-0 accent-action-primary" />
          <span>
            Acepto los{" "}
            <Link href="/terminos" target="_blank" className="font-semibold text-foreground-primary underline decoration-emergency decoration-2 underline-offset-2 hover:text-emergency-dark">
              términos y condiciones
            </Link>{" "}
            y el{" "}
            <Link href="/privacidad" target="_blank" className="font-semibold text-foreground-primary underline decoration-emergency decoration-2 underline-offset-2 hover:text-emergency-dark">
              aviso de privacidad
            </Link>
            .
          </span>
        </label>

        {state?.error && (
          <p className="border-2 border-emergency-dark bg-surface-card px-md py-2.5 font-body text-sm font-semibold text-emergency-dark">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending}>
          {pending ? "Creando cuenta…" : "Crear cuenta de vendedor"}
        </Button>
      </form>

      <SeparadorO />
      <BotonGoogle label="Registrarme con Google" />
    </div>
  );
}
