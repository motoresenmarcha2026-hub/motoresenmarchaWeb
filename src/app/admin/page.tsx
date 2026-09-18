import { Users, Store, ClipboardList, Calendar, Star, ShoppingBag, Package } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Rating } from "@/components/ui/Rating";
import { requireAdmin } from "@/lib/auth/dal";
import { getResumenAdmin } from "@/features/admin/data";
import { BotonLimpiarDemo } from "@/features/admin/components/BotonLimpiarDemo";
import { adminShell } from "@/features/usuarios/shell";
import { formatearFecha, formatearPrecio } from "@/lib/utils";

export default async function AdminResumenPage() {
  const perfil = await requireAdmin();
  const r = await getResumenAdmin();

  const CONTEOS = [
    { icono: Users, label: "Conductores", valor: r.conteos.conductores },
    { icono: Store, label: "Talleres", valor: r.conteos.talleres },
    { icono: ShoppingBag, label: "Vendedores", valor: r.conteos.vendedores },
    { icono: Package, label: "Refacciones", valor: r.conteos.refacciones },
    { icono: ClipboardList, label: "Solicitudes", valor: r.conteos.solicitudes },
    { icono: Calendar, label: "Citas", valor: r.conteos.citas },
    { icono: Star, label: "Reseñas", valor: r.conteos.resenas },
  ];

  return (
    <DashboardShell profile={adminShell(perfil)} navKey="admin">
      <div className="flex flex-col gap-lg">
        <div>
          <h1 className="font-heading text-2xl font-extrabold uppercase text-foreground-primary">
            Resumen de la plataforma
          </h1>
          <p className="font-body text-foreground-secondary">
            Vista general de usuarios, talleres y actividad.
          </p>
        </div>

        {/* Conteos: manifiesto reglado, no tarjetas de stat. */}
        <section className="border-2 border-border-primary bg-surface-card">
          <div className="border-b-2 border-border-primary bg-surface-inverse px-md py-1.5">
            <h2 className="font-heading text-xs font-extrabold uppercase tracking-[0.14em] text-foreground-inverse">
              Conteos
            </h2>
          </div>
          <ul>
            {CONTEOS.map((c) => {
              const Icono = c.icono;
              return (
                <li
                  key={c.label}
                  className="flex items-center justify-between gap-md border-b border-border-subtle px-md py-sm last:border-b-0"
                >
                  <span className="flex items-center gap-sm font-heading text-xs font-extrabold uppercase tracking-[0.08em] text-foreground-secondary">
                    <Icono size={16} className="text-accent-primary" aria-hidden />
                    {c.label}
                  </span>
                  <span className="cifras font-heading text-xl font-extrabold text-foreground-primary">
                    {c.valor}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Solicitudes recientes */}
        <Panel titulo="Últimas solicitudes">
          {r.solicitudes.length === 0 ? (
            <Vacio texto="Sin solicitudes todavía." />
          ) : (
            <ul className="divide-y divide-border-subtle">
              {r.solicitudes.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-sm py-sm">
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground-primary capitalize">
                      {s.tipo_problema} · {s.prioridad}
                    </p>
                    <p className="font-caption text-xs text-foreground-secondary">
                      {s.cliente_nombre ?? "Sin nombre"} · {formatearFecha(s.created_at)}
                    </p>
                  </div>
                  <Chip texto={s.estado} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Citas recientes */}
        <Panel titulo="Últimas citas">
          {r.citas.length === 0 ? (
            <Vacio texto="Sin citas todavía." />
          ) : (
            <ul className="divide-y divide-border-subtle">
              {r.citas.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-sm py-sm">
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground-primary">
                      {c.taller_nombre ?? "Taller"} · {c.servicio ?? "Servicio"}
                    </p>
                    <p className="font-caption text-xs text-foreground-secondary">
                      {c.cliente_nombre ?? "Cliente"} · {formatearFecha(c.fecha)} {c.hora}
                    </p>
                  </div>
                  <Chip texto={c.estado} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Talleres */}
        <Panel titulo="Talleres (por calificación)">
          {r.talleres.length === 0 ? (
            <Vacio texto="Sin talleres registrados." />
          ) : (
            <ul className="divide-y divide-border-subtle">
              {r.talleres.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-sm py-sm">
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground-primary">
                      {t.nombre}
                      {t.verificado && (
                        <span className="ml-xs font-caption text-xs text-status-available">
                          ✓ Verificado
                        </span>
                      )}
                    </p>
                    <p className="font-caption text-xs text-foreground-secondary">
                      {t.ciudad ?? "Sin ciudad"} · {t.num_resenas} reseñas
                    </p>
                  </div>
                  <Rating valor={Number(t.rating)} size={14} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Vendedores */}
        <Panel titulo="Vendedores de refacciones">
          {r.vendedores.length === 0 ? (
            <Vacio texto="Sin vendedores registrados." />
          ) : (
            <ul className="divide-y divide-border-subtle">
              {r.vendedores.map((v) => (
                <li key={v.id} className="flex flex-wrap items-center justify-between gap-sm py-sm">
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground-primary">
                      {v.nombre_negocio}
                      {v.verificado && (
                        <span className="ml-xs font-caption text-xs text-status-available">
                          ✓ Verificado
                        </span>
                      )}
                    </p>
                    <p className="font-caption text-xs text-foreground-secondary">
                      {v.ciudad ?? "Sin ciudad"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Refacciones recientes */}
        <Panel titulo="Últimas refacciones">
          {r.refacciones.length === 0 ? (
            <Vacio texto="Sin refacciones publicadas." />
          ) : (
            <ul className="divide-y divide-border-subtle">
              {r.refacciones.map((re) => (
                <li key={re.id} className="flex flex-wrap items-center justify-between gap-sm py-sm">
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground-primary">
                      {re.nombre}
                    </p>
                    <p className="font-caption text-xs text-foreground-secondary">
                      {re.vendedor_nombre ?? "Vendedor"} · {formatearFecha(re.created_at)}
                    </p>
                  </div>
                  <span className="font-data text-sm font-bold text-foreground-primary">
                    {formatearPrecio(re.precio)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Reseñas recientes */}
        <Panel titulo="Últimas reseñas">
          {r.resenas.length === 0 ? (
            <Vacio texto="Sin reseñas todavía." />
          ) : (
            <ul className="divide-y divide-border-subtle">
              {r.resenas.map((re) => (
                <li key={re.id} className="py-sm">
                  <div className="flex flex-wrap items-center justify-between gap-sm">
                    <p className="font-body text-sm font-semibold text-foreground-primary">
                      {re.autor} → {re.taller_nombre ?? "Taller"}
                    </p>
                    <Rating valor={re.rating} size={14} />
                  </div>
                  {re.comentario && (
                    <p className="mt-xs font-caption text-xs text-foreground-secondary">
                      {re.comentario}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Mantenimiento: datos de demostración */}
        <Panel titulo="Datos de demostración">
          <BotonLimpiarDemo demoCount={r.demoTalleres} />
        </Panel>

        {/* Usuarios recientes */}
        <Panel titulo="Usuarios recientes">
          {r.usuarios.length === 0 ? (
            <Vacio texto="Sin usuarios." />
          ) : (
            <ul className="divide-y divide-border-subtle">
              {r.usuarios.map((u) => (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-sm py-sm">
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground-primary">
                      {u.nombre ?? "Sin nombre"}
                    </p>
                    <p className="font-caption text-xs text-foreground-secondary">
                      {u.ciudad ?? "Sin ciudad"}
                    </p>
                  </div>
                  <Chip texto={u.rol} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}

function Panel({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-2 border-border-primary bg-surface-card">
      <div className="border-b-2 border-border-primary bg-surface-inverse px-md py-1.5">
        <h2 className="font-heading text-xs font-extrabold uppercase tracking-[0.14em] text-foreground-inverse">
          {titulo}
        </h2>
      </div>
      <div className="p-md">{children}</div>
    </section>
  );
}

function Chip({ texto }: { texto: string }) {
  return (
    <span className="inline-flex items-center rounded-none bg-action-primary px-sm py-1 font-heading text-xs font-extrabold uppercase tracking-[0.08em] text-foreground-inverse">
      {texto}
    </span>
  );
}

function Vacio({ texto }: { texto: string }) {
  return (
    <p className="rounded-none border-2 border-dashed border-border-primary p-lg text-center font-body text-sm text-foreground-secondary">
      {texto}
    </p>
  );
}
