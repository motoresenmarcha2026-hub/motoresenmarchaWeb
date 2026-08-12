"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/FormField";

export interface CampoCuenta {
  label: string;
  valor: string;
  type?: string;
  anchoCompleto?: boolean;
}

/** Formulario de "Información de la cuenta" reutilizable (taller/conductor/admin). */
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

  return (
    <div className="flex flex-col gap-md">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground-primary">
          {titulo}
        </h1>
        <p className="font-body text-foreground-secondary">{descripcion}</p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface-card p-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground-primary">
            {seccionLabel}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditando((v) => !v)}
          >
            <Pencil size={14} /> {editando ? "Cancelar" : "Editar"}
          </Button>
        </div>

        <div className="grid gap-md sm:grid-cols-2">
          {campos.map((c) => (
            <FormField
              key={c.label}
              label={c.label}
              className={cn(c.anchoCompleto && "sm:col-span-2")}
            >
              <Input
                type={c.type ?? "text"}
                defaultValue={c.valor}
                disabled={!editando}
                className={cn(!editando && "bg-surface-page")}
              />
            </FormField>
          ))}
        </div>

        {children}

        {editando && (
          <div className="mt-lg flex justify-end gap-sm">
            <Button variant="ghost" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setEditando(false)}>
              {/* TODO: conectar a Supabase — persistir cambios de la cuenta */}
              Guardar cambios
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
