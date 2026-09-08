import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Botón del mundo: banderín de plantilla.
 * El borde derecho va sesgado como el banderín de la locomotora, las
 * versales van en la cara de plantilla, y al presionar el botón avanza —
 * "los estados presionados empujan hacia adelante".
 *
 * Los seis nombres de variante se conservan como API pública
 * (primary, outline, ghost, whatsapp, emergency, urgent): el sitio entero
 * los usa y nada aguas arriba se rompe.
 *
 * El rojo está racionado: `primary` es la tinta negra de todos los días y
 * `emergency`/`urgent` son la cuña que empuja. No al revés.
 */
export const buttonVariants = cva(
  [
    "banderin group/btn relative inline-flex items-center justify-center gap-sm",
    "whitespace-nowrap rounded-none font-heading font-extrabold uppercase",
    "tracking-[0.06em] leading-none",
    "transition-[background-color,color,transform] duration-150 ease-press",
    "active:translate-x-[2px]",
    "focus-visible:outline-3 focus-visible:outline-emergency focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-40 disabled:saturate-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-action-primary text-foreground-inverse hover:bg-action-primary-dark",
        // `filete-banderin` pinta el borde con el fondo (border-box tinta,
        // padding-box papel) para que el sesgo del banderín lo recorte sin
        // dejar el filete abierto por la derecha.
        outline:
          "filete-banderin text-foreground-primary hover:text-foreground-inverse",
        ghost:
          "banderin-none text-foreground-primary underline-offset-4 hover:text-emergency hover:underline hover:decoration-2",
        whatsapp:
          "bg-whatsapp text-foreground-inverse hover:bg-whatsapp-dark",
        emergency:
          "bg-emergency text-foreground-inverse hover:bg-emergency-dark",
        urgent:
          "bg-action-urgent text-foreground-inverse hover:bg-action-urgent-dark",
      },
      size: {
        // Áreas táctiles generosas: la escena confirmada es una mano en la calle.
        sm: "h-11 px-md pr-lg text-sm",
        md: "h-12 px-lg pr-xl text-base",
        lg: "h-14 px-xl pr-2xl text-lg",
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
