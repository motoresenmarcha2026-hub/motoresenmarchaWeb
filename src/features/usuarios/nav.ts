import {
  Calendar,
  Store,
  ClipboardList,
  MapPin,
  Star,
  Bell,
  User,
  Car,
  Users,
  ShieldAlert,
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
  { href: "#agenda", label: "Agenda", icon: Calendar },
  { href: "/panel/cuenta", label: "Mi taller", icon: Store },
  {
    href: "/panel/solicitudes",
    label: "Citas y solicitudes",
    icon: ClipboardList,
    badge: 2,
  },
  { href: "#sucursales", label: "Sucursales", icon: MapPin },
  { href: "#resenas", label: "Reseñas", icon: Star },
  { href: "#notificaciones", label: "Notificaciones", icon: Bell },
];

/** Navegación de la cuenta del conductor. */
export const NAV_CONDUCTOR: NavItem[] = [
  { href: "/cuenta", label: "Cuenta", icon: User },
  { href: "#vehiculo", label: "Vehículo", icon: Car },
  { href: "#solicitudes", label: "Mis solicitudes", icon: ClipboardList },
  { href: "/citas/mis-citas", label: "Mis citas", icon: Calendar },
  { href: "#notificaciones", label: "Notificaciones", icon: Bell },
];

/** Navegación del panel de administración. */
export const NAV_ADMIN: NavItem[] = [
  { href: "/admin/cuenta", label: "Mi cuenta", icon: User },
  { href: "#usuarios", label: "Usuarios", icon: Users },
  { href: "#talleres", label: "Talleres", icon: Store },
  { href: "#moderacion", label: "Moderación", icon: ShieldAlert },
  { href: "#reportes", label: "Reportes", icon: BarChart3 },
];

/** Mapa de navegaciones por rol (evita pasar componentes de íconos a través del boundary server→client). */
export const NAVS = {
  taller: NAV_TALLER,
  conductor: NAV_CONDUCTOR,
  admin: NAV_ADMIN,
} as const;

export type NavKey = keyof typeof NAVS;
