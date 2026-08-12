import {
  Cog,
  Disc3,
  BatteryCharging,
  LifeBuoy,
  Snowflake,
  Zap,
  Car,
  Settings2,
  Gauge,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Registro de íconos usados por los catálogos (especialidades / tipos de
 * problema). Mapea el nombre string guardado en el mock (y futura BD) a su
 * componente de lucide-react, evitando importar toda la librería.
 */
const REGISTRO: Record<string, LucideIcon> = {
  Cog,
  Disc3,
  BatteryCharging,
  LifeBuoy,
  Snowflake,
  Zap,
  Car,
  Settings2,
  Gauge,
  Wrench,
};

interface IconoProps {
  /** Nombre del ícono (debe existir en el registro). */
  nombre: string;
  className?: string;
  size?: number;
}

export function Icono({ nombre, className, size = 24 }: IconoProps) {
  const Componente = REGISTRO[nombre] ?? Wrench;
  return <Componente className={className} size={size} aria-hidden />;
}
