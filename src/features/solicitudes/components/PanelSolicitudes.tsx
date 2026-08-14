"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { cn, formatearFecha } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { TarjetaSolicitud } from "./TarjetaSolicitud";
import { rowToSolicitud, type SolicitudRow } from "../mappers";
import type { Solicitud, EstadoSolicitud } from "../types";
import type { Cita, EstadoCita } from "@/features/citas/types";

type Tab = "todas" | EstadoSolicitud;

const TABS: { key: Tab; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "pendiente", label: "Pendientes" },
  { key: "agendado", label: "Agendadas" },
  { key: "completado", label: "Completadas" },
];

const ESTADO_CITA: Record<EstadoCita, { label: string; class: string }> = {
  pendiente: { label: "Pendiente", class: "bg-action-urgent/15 text-action-urgent" },
  confirmada: { label: "Confirmada", class: "bg-action-primary/15 text-action-primary" },
  completada: { label: "Completada", class: "bg-status-available/15 text-status-available" },
  cancelada: { label: "Cancelada", class: "bg-status-busy/15 text-status-busy" },
};

/**
 * Panel del taller: solicitudes (con Realtime) + citas agendadas.
 * Las solicitudes nuevas llegan al instante vía Supabase Realtime
 * (RLS `solicitudes_taller_read` filtra a las del taller).
 */
export function PanelSolicitudes({
  solicitudes,
  citas,
  tallerId,
}: {
  solicitudes: Solicitud[];
  citas: Cita[];
  tallerId: string;
}) {
  const [tab, setTab] = useState<Tab>("todas");
  // Datos iniciales del SSR; Realtime (INSERT/UPDATE) mantiene la lista al día.
  const [items, setItems] = useState<Solicitud[]>(solicitudes);

  // Suscripción Realtime a nuevas solicitudes y cambios de estado.
  useEffect(() => {
    const supabase = createClient();

    // Nombre de canal único por montaje: evita que `channel()` reutilice un
    // canal ya suscrito (bug de StrictMode → "on after subscribe").
    const topic = `panel-solicitudes-${tallerId}-${Math.random().toString(36).slice(2)}`;

    // Canal + handlers se crean de forma SÍNCRONA (evita "on after subscribe").
    const channel = supabase
      .channel(topic)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "solicitudes",
          filter: `taller_id=eq.${tallerId}`,
        },
        (payload) => {
          const nueva = rowToSolicitud(payload.new as SolicitudRow);
          setItems((prev) =>
            prev.some((s) => s.id === nueva.id) ? prev : [nueva, ...prev]
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "solicitudes",
          filter: `taller_id=eq.${tallerId}`,
        },
        (payload) => {
          const upd = rowToSolicitud(payload.new as SolicitudRow);
          setItems((prev) => prev.map((s) => (s.id === upd.id ? upd : s)));
        }
      );

    // Autentica el socket con el JWT del usuario para que RLS entregue solo
    // las solicitudes de este taller (`solicitudes_taller_read`), luego suscribe.
    let cancelado = false;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) await supabase.realtime.setAuth(session.access_token);
      if (!cancelado) channel.subscribe();
    })();

    return () => {
      cancelado = true;
      supabase.removeChannel(channel);
    };
  }, [tallerId]);

  const filtradas =
    tab === "todas" ? items : items.filter((s) => s.estado === tab);

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-md">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground-primary">
            Citas y solicitudes
          </h1>
          <p className="font-body text-foreground-secondary">
            Gestiona las solicitudes de tus clientes y agenda citas.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-xs overflow-x-auto border-b border-border-subtle">
          {TABS.map((t) => {
            const activo = tab === t.key;
            const count =
              t.key === "todas"
                ? items.length
                : items.filter((s) => s.estado === t.key).length;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "shrink-0 border-b-2 px-sm py-sm font-caption text-sm font-semibold transition-colors",
                  activo
                    ? "border-action-primary text-action-primary"
                    : "border-transparent text-foreground-secondary hover:text-foreground-primary"
                )}
              >
                {t.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Lista de solicitudes */}
        {filtradas.length > 0 ? (
          <div className="flex flex-col gap-md">
            {filtradas.map((s) => (
              <TarjetaSolicitud key={s.id} solicitud={s} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border-subtle p-xl text-center font-body text-sm text-foreground-secondary">
            No hay solicitudes en esta categoría.
          </p>
        )}
      </div>

      {/* Citas agendadas */}
      <section className="flex flex-col gap-md">
        <h2 className="font-heading text-xl font-bold text-foreground-primary">
          Citas agendadas ({citas.length})
        </h2>
        {citas.length > 0 ? (
          <div className="flex flex-col gap-sm">
            {citas.map((c) => {
              const est = ESTADO_CITA[c.estado];
              return (
                <article
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-sm rounded-xl border border-border-subtle bg-surface-card p-md"
                >
                  <div className="flex items-center gap-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-page text-accent-primary">
                      <Calendar size={18} />
                    </span>
                    <div>
                      <p className="font-heading text-sm font-bold text-foreground-primary">
                        {c.clienteNombre} · {c.servicio}
                      </p>
                      <p className="font-caption text-xs text-foreground-secondary">
                        {formatearFecha(c.fecha)} · {c.hora}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-sm py-xs font-caption text-xs font-semibold",
                      est.class
                    )}
                  >
                    {est.label}
                  </span>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border-subtle p-lg text-center font-body text-sm text-foreground-secondary">
            Aún no tienes citas agendadas.
          </p>
        )}
      </section>
    </div>
  );
}
