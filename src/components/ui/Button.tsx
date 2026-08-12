import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Botón base con las variantes del sistema de diseño (Pencil):
 * primary, outline, ghost, whatsapp, emergency, urgent.
 * Se exporta `buttonVariants` para estilar <Link> u <a> con la misma apariencia.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-sm whitespace-nowrap rounded-lg font-body font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-action-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-action-primary text-foreground-inverse hover:bg-action-primary-dark",
        outline:
          "border border-border-primary bg-transparent text-foreground-primary hover:bg-foreground-primary hover:text-foreground-inverse",
        ghost: "text-foreground-primary hover:bg-black/5",
        whatsapp:
          "bg-whatsapp text-foreground-inverse hover:bg-whatsapp-dark",
        emergency:
          "bg-emergency text-foreground-inverse hover:bg-emergency-dark",
        urgent:
          "bg-action-urgent text-foreground-inverse hover:bg-action-urgent-dark",
      },
      size: {
        sm: "h-9 px-md text-sm",
        md: "h-11 px-lg text-sm",
        lg: "h-12 px-xl text-base",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
