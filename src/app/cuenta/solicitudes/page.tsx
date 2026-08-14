import { ClipboardList } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { requirePerfil } from "@/lib/auth/dal";
import { perfilShell } from "@/features/usuarios/shell";
import { getSolicitudesDelConductor } from "@/features/solicitudes/data";
import { tipoProblemaMeta } from "@/features/solicitudes/mock";
import { formatearFecha } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ESTADO_LABEL: Record<string, { label: string; class: string }> = {
  pendiente: { label: "Pendiente", class: "bg-action-urgent/15 text-action-urgent" },
  agendado: { label: "Agendada", class: "bg-status-available/15 text-status-available" },
  completado: { label: "Completada", class: "bg-action-primary/15 text-action-primary" },
  rechazado: { label: "Rechazada", class: "bg-status-busy/15 text-status-busy" },
};

export default async function MisSolicitudesPage() {
  const perfil = await requirePerfil();
  const solicitudes = await getSolicitudesDelConductor();

  return (
    <DashboardShell profile={perfilShell(perfil)} navKey="conductor">
      {solicitudes.length === 0 ? (
        <EstadoVacio
          icono={ClipboardList}
          titulo="Aún no tienes solicitudes"
          descripcion="Cuando pidas ayuda a un taller por WhatsApp, tus solicitudes quedarán registradas aquí."
          cta={{ href: "/solicitar", label: "Solicitar servicio" }}
        />
      ) : (
        <div className="flex flex-col gap-md">
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-foreground-primary">
              Mis solicitudes
            </h1>
            <p className="font-body text-foreground-secondary">
              Historial de tus solicitudes de servicio.
            </p>
          </div>
          <ul className="flex flex-col gap-sm">
            {solicitudes.map((s) => {
              const estado =
                ESTADO_LABEL[s.estado] ?? ESTADO_LABEL.pendiente;
              return (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-sm rounded-2xl border border-border-subtle bg-surface-card p-md"
                >
                  <div>
                    <p className="font-heading font-bold text-foreground-primary">
                      {tipoProblemaMeta(s.tipoProblema).label}
                    </p>
                    <p className="font-caption text-sm text-foreground-secondary">
                      {s.descripcion || "Sin descripción"} ·{" "}
                      {formatearFecha(s.createdAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-sm py-xs font-caption text-xs font-semibold",
                      estado.class
                    )}
                  >
                    {estado.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </DashboardShell>
  );
}
