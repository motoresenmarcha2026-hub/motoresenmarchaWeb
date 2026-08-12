import Link from "next/link";
import { FormField, Input } from "@/components/ui/FormField";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-[26rem] flex-col gap-lg">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-extrabold text-foreground-primary">
          Inicia sesión
        </h1>
        <p className="mt-xs font-body text-foreground-secondary">
          Accede a tu cuenta de Motores en Marcha.
        </p>
      </div>

      {/* TODO: conectar a Supabase Auth — autenticación real. */}
      <form className="flex flex-col gap-md rounded-2xl border border-border-subtle bg-surface-card p-lg">
        <FormField label="Correo electrónico" htmlFor="email" required>
          <Input id="email" type="email" placeholder="tucorreo@ejemplo.mx" required />
        </FormField>
        <FormField label="Contraseña" htmlFor="pass" required>
          <Input id="pass" type="password" placeholder="••••••••" required />
        </FormField>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "primary", size: "lg", fullWidth: true }))}
        >
          Entrar
        </Link>
      </form>

      <p className="text-center font-caption text-sm text-foreground-secondary">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-action-primary hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
