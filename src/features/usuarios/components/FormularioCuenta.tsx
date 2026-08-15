"use client";

import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/FormField";
import { actualizarPerfil } from "@/features/usuarios/actions";

export interface CampoCuenta {
  label: string;
  valor: string;
  type?: string;
  anchoCompleto?: boolean;
  /** name del campo en el formulario; sin name el campo es solo lectura. */
  name?: string;
}

/** Formulario de "Información de la cuenta" (guarda en `profiles`). */
export function FormularioCuenta({
  titulo,
  descripcion,
  seccionLabel = "Datos personales",
  campos,
  children,
}: {
  titulo: string;
  descripcion: string;
  seccionLabel?: string;
  campos: CampoCuenta[];
  children?: React.ReactNode;
}) {
  const [editando, setEditando] = useState(false);
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function guardar() {
    if (!formRef.current || pendiente) return;
    setPendiente(true);
    setError(null);
    setGuardado(false);
    const res = await actualizarPerfil(
      undefined,
      new FormData(formRef.current)
    );
    setPendiente(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    setGuardado(true);
    setEditando(false);
  }

  return (
    <div className="flex flex-col gap-md">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground-primary">
          {titulo}
        </h1>
        <p className="font-body text-foreground-secondary">{descripcion}</p>
      </div>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          guardar();
        }}
        className="rounded-2xl border border-border-subtle bg-surface-card p-lg"
      >
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground-primary">
            {seccionLabel}
          </h2>
          {!editando && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditando(true);
                setGuardado(false);
              }}
            >
              <Pencil size={14} /> Editar
            </Button>
          )}
        </div>

        {/* key reinicia los defaultValue al cancelar la edición */}
        <div key={String(editando)} className="grid gap-md sm:grid-cols-2">
          {campos.map((c) => {
            const editable = Boolean(c.name);
            return (
              <FormField
                key={c.label}
                label={c.label}
                htmlFor={c.name}
                className={cn(c.anchoCompleto && "sm:col-span-2")}
              >
                <Input
                  id={c.name}
                  name={c.name}
                  type={c.type ?? "text"}
                  defaultValue={c.valor}
                  disabled={!editando || !editable}
                  title={c.valor}
                  className={cn(
                    "overflow-hidden text-ellipsis",
                    (!editando || !editable) && "bg-surface-page"
                  )}
                />
              </FormField>
            );
          })}
        </div>

        {children}

        {error && editando && (
          <p className="mt-md rounded-lg bg-emergency/10 px-md py-2.5 font-caption text-sm text-emergency">
            {error}
          </p>
        )}
        {guardado && (
          <p className="mt-md rounded-lg bg-status-available/10 px-md py-2.5 font-caption text-sm text-status-available">
            Datos guardados.
          </p>
        )}

        {editando && (
          <div className="mt-lg flex justify-end gap-sm">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditando(false)}
              disabled={pendiente}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={pendiente}>
              {pendiente ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
