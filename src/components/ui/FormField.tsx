import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Campo de formulario: label + control + hint/error. */
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-xs", className)}>
      <label
        htmlFor={htmlFor}
        className="font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-primary"
      >
        {label}
        {required && <span className="text-emergency-dark"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="font-body text-sm text-foreground-secondary">{hint}</p>
      )}
      {error && (
        <p className="font-body text-sm font-semibold text-emergency-dark">{error}</p>
      )}
    </div>
  );
}

/**
 * Estilos base compartidos para inputs / textareas / selects.
 * Filete de tinta de 2px y foco en rojo de prensa — sin halo suave, que es
 * aire y este mundo separa con tinta. Alcanza los formularios de todo el
 * sitio, así que es la misma palanca que los tokens.
 */
export const inputBaseClass =
  "w-full rounded-none border-2 border-border-primary bg-surface-card px-md py-3 font-body text-base text-foreground-primary placeholder:text-foreground-secondary transition-colors focus:border-emergency focus:outline-none";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(inputBaseClass, className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(inputBaseClass, "min-h-24 resize-y", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";
