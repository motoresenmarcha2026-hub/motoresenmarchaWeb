"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormField, Input } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { iniciarSesion } from "@/features/usuarios/actions";
import { BotonGoogle, SeparadorO } from "@/features/usuarios/components/BotonGoogle";

export default function LoginPage() {
  const [state, action, pending] = useActionState(iniciarSesion, undefined);

  return (
    <div className="mx-auto flex max-w-[26rem] flex-col gap-lg">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-extrabold uppercase leading-none text-foreground-primary md:text-5xl">
          Inicia sesión
        </h1>
        <p className="mt-xs font-body text-foreground-secondary">
          Accede a tu cuenta de Motores en Marcha.
        </p>
      </div>

      <div className="flex flex-col gap-md border-2 border-border-primary bg-surface-card p-lg">
        <form action={action} className="flex flex-col gap-md">
          <FormField label="Correo electrónico" htmlFor="email" required>
            <Input id="email" name="email" type="email" placeholder="tucorreo@ejemplo.mx" required />
          </FormField>
          <FormField label="Contraseña" htmlFor="password" required>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </FormField>

          {state?.error && (
            <p className="border-2 border-emergency-dark bg-surface-card px-md py-2.5 font-body text-sm font-semibold text-emergency-dark">
              {state.error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending}>
            {pending ? "Entrando…" : "Entrar"}
          </Button>
        </form>

        <SeparadorO />
        <BotonGoogle />
      </div>

      <p className="text-center font-body text-sm text-foreground-secondary">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="inline-flex min-h-11 items-center font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-primary underline-offset-4 hover:text-emergency-dark hover:underline hover:decoration-2">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
