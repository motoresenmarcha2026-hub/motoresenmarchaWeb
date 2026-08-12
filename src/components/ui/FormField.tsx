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
        className="font-caption text-sm font-semibold text-foreground-primary"
      >
        {label}
        {required && <span className="text-emergency"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="font-caption text-xs text-foreground-secondary">{hint}</p>
      )}
      {error && (
        <p className="font-caption text-xs text-emergency">{error}</p>
      )}
    </div>
  );
}

/** Estilos base compartidos para inputs / textareas / selects. */
export const inputBaseClass =
  "w-full rounded-lg border border-border-subtle bg-surface-card px-md py-2.5 font-body text-sm text-foreground-primary placeholder:text-foreground-secondary focus:border-action-primary focus:outline-none focus:ring-2 focus:ring-action-primary/20 transition-colors";

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
