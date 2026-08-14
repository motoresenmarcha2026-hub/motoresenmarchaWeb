"use client";

import { useActionState } from "react";
import { FormField, Input } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { registrarConductor } from "@/features/usuarios/actions";
import { BotonGoogle, SeparadorO } from "./BotonGoogle";

/** Formulario de registro de conductor (Supabase Auth). */
export function FormRegistroConductor() {
  const [state, action, pending] = useActionState(registrarConductor, undefined);

  return (
    <div className="flex flex-col gap-md">
      <form action={action} className="flex flex-col gap-md">
        <div className="grid gap-md sm:grid-cols-2">
          <FormField label="Nombre completo" htmlFor="nombre" required className="sm:col-span-2">
            <Input id="nombre" name="nombre" placeholder="Ej. Juan Pérez" required />
          </FormField>
          <FormField label="Correo electrónico" htmlFor="email" required>
            <Input id="email" name="email" type="email" placeholder="tucorreo@ejemplo.mx" required />
          </FormField>
          <FormField label="Teléfono / WhatsApp" htmlFor="telefono" required>
            <Input id="telefono" name="telefono" type="tel" placeholder="+52 55 1234 5678" required />
          </FormField>
          <FormField label="Ciudad" htmlFor="ciudad">
            <Input id="ciudad" name="ciudad" placeholder="Ciudad de México" />
          </FormField>
          <FormField label="Contraseña" htmlFor="password" required hint="Mínimo 8 caracteres.">
            <Input id="password" name="password" type="password" placeholder="••••••••" minLength={8} required />
          </FormField>
        </div>

        <label className="flex items-start gap-sm font-caption text-sm text-foreground-secondary">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-action-primary" />
          Acepto los términos y condiciones y el aviso de privacidad.
        </label>

        {state?.error && (
          <p className="rounded-lg bg-emergency/10 px-md py-2.5 font-caption text-sm text-emergency">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending}>
          {pending ? "Creando cuenta…" : "Crear cuenta de conductor"}
        </Button>
      </form>

      <SeparadorO />
      <BotonGoogle label="Registrarme con Google" />
    </div>
  );
}
