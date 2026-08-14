import {
  Calendar,
  Store,
  ClipboardList,
  MapPin,
  Star,
  Bell,
  User,
  Car,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

/** Navegación del panel del taller/mecánico. */
export const NAV_TALLER: NavItem[] = [
  {
    href: "/panel/solicitudes",
    label: "Citas y solicitudes",
    icon: ClipboardList,
  },
  { href: "/panel/cuenta", label: "Mi taller", icon: Store },
  { href: "/panel/resenas", label: "Reseñas", icon: Star },
  { href: "/panel/sucursales", label: "Sucursales", icon: MapPin },
  { href: "/panel/notificaciones", label: "Notificaciones", icon: Bell },
];

/** Navegación de la cuenta del conductor. */
export const NAV_CONDUCTOR: NavItem[] = [
  { href: "/cuenta", label: "Cuenta", icon: User },
  { href: "/cuenta/vehiculo", label: "Vehículo", icon: Car },
  { href: "/cuenta/solicitudes", label: "Mis solicitudes", icon: ClipboardList },
  { href: "/citas/mis-citas", label: "Mis citas", icon: Calendar },
  { href: "/cuenta/notificaciones", label: "Notificaciones", icon: Bell },
];

/** Navegación del panel de administración. */
export const NAV_ADMIN: NavItem[] = [
  { href: "/admin", label: "Resumen", icon: BarChart3 },
  { href: "/admin/cuenta", label: "Mi cuenta", icon: User },
];

/** Mapa de navegaciones por rol (evita pasar componentes de íconos a través del boundary server→client). */
export const NAVS = {
  taller: NAV_TALLER,
  conductor: NAV_CONDUCTOR,
  admin: NAV_ADMIN,
} as const;

export type NavKey = keyof typeof NAVS;
