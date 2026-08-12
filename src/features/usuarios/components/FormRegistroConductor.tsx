"use client";

import { useRouter } from "next/navigation";
import { FormField, Input } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

/** Formulario de registro de conductor (mock, sin backend). */
export function FormRegistroConductor() {
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: conectar a Supabase Auth — crear cuenta de conductor.
    router.push("/confirmacion?tipo=conductor");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-md">
      <div className="grid gap-md sm:grid-cols-2">
        <FormField label="Nombre completo" htmlFor="nombre" required className="sm:col-span-2">
          <Input id="nombre" placeholder="Ej. Juan Pérez" required />
        </FormField>
        <FormField label="Correo electrónico" htmlFor="email" required>
          <Input id="email" type="email" placeholder="tucorreo@ejemplo.mx" required />
        </FormField>
        <FormField label="Teléfono / WhatsApp" htmlFor="tel" required>
          <Input id="tel" type="tel" placeholder="+52 55 1234 5678" required />
        </FormField>
        <FormField label="Ciudad" htmlFor="ciudad">
          <Input id="ciudad" placeholder="Ciudad de México" />
        </FormField>
        <FormField label="Contraseña" htmlFor="pass" required>
          <Input id="pass" type="password" placeholder="••••••••" required />
        </FormField>
      </div>

      <fieldset className="rounded-xl border border-border-subtle p-md">
        <legend className="px-xs font-caption text-sm font-semibold text-foreground-secondary">
          Tu vehículo (opcional)
        </legend>
        <div className="grid gap-md sm:grid-cols-3">
          <FormField label="Marca" htmlFor="marca">
            <Input id="marca" placeholder="Nissan" />
          </FormField>
          <FormField label="Modelo" htmlFor="modelo">
            <Input id="modelo" placeholder="Versa" />
          </FormField>
          <FormField label="Año" htmlFor="anio">
            <Input id="anio" type="number" placeholder="2019" />
          </FormField>
        </div>
      </fieldset>

      <label className="flex items-start gap-sm font-caption text-sm text-foreground-secondary">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-action-primary" />
        Acepto los términos y condiciones y el aviso de privacidad.
      </label>

      <Button type="submit" variant="primary" size="lg" fullWidth>
        Crear cuenta de conductor
      </Button>
    </form>
  );
}
