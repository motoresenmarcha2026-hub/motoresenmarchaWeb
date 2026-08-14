import { Users, Store, ClipboardList, Calendar, Star } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Rating } from "@/components/ui/Rating";
import { requireAdmin } from "@/lib/auth/dal";
import { getResumenAdmin } from "@/features/admin/data";
import { formatearFecha } from "@/lib/utils";

export default async function AdminResumenPage() {
  const perfil = await requireAdmin();
  const r = await getResumenAdmin();

  return (
    <DashboardShell
      profile={{
        nombre: perfil.nombre ?? "Administrador",
        subtitulo: "Administración",
        avatarUrl: perfil.avatar_url ?? undefined,
        badge: "Admin",
      }}
      navKey="admin"
    >
      <div className="flex flex-col gap-lg">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground-primary">
            Resumen de la plataforma
          </h1>
          <p className="font-body text-foreground-secondary">
            Vista general de usuarios, talleres y actividad.
          </p>
        </div>

        {/* Conteos */}
        <div className="grid grid-cols-2 gap-sm md:grid-cols-5">
          <Stat icono={<Users size={18} />} label="Conductores" valor={r.conteos.conductores} />
          <Stat icono={<Store size={18} />} label="Talleres" valor={r.conteos.talleres} />
          <Stat icono={<ClipboardList size={18} />} label="Solicitudes" valor={r.conteos.solicitudes} />
          <Stat icono={<Calendar size={18} />} label="Citas" valor={r.conteos.citas} />
          <Stat icono={<Star size={18} />} label="Reseñas" valor={r.conteos.resenas} />
        </div>

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
                      {re.autor} → {re.taller_id}
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

function Stat({
  icono,
  label,
  valor,
}: {
  icono: React.ReactNode;
  label: string;
  valor: number;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-card p-md">
      <span className="text-accent-primary">{icono}</span>
      <p className="mt-xs font-data text-2xl font-bold text-foreground-primary">
        {valor}
      </p>
      <p className="font-caption text-xs text-foreground-secondary">{label}</p>
    </div>
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
    <section className="rounded-2xl border border-border-subtle bg-surface-card p-lg">
      <h2 className="mb-sm font-heading text-lg font-bold text-foreground-primary">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Chip({ texto }: { texto: string }) {
  return (
    <span className="rounded-full bg-surface-page px-sm py-xs font-caption text-xs font-semibold capitalize text-foreground-secondary">
      {texto}
    </span>
  );
}

function Vacio({ texto }: { texto: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border-subtle p-lg text-center font-body text-sm text-foreground-secondary">
      {texto}
    </p>
  );
}
