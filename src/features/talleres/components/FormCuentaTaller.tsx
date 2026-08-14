"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Pencil, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { Tag } from "@/components/ui/Tag";
import { createClient } from "@/lib/supabase/client";
import { especialidadMeta } from "@/features/talleres/mock";
import { actualizarTaller, actualizarFotoTaller } from "@/features/talleres/actions";
import type { Taller } from "@/features/talleres/types";

/** Panel de cuenta del taller: editar datos reales + subir foto a Storage. */
export function FormCuentaTaller({
  taller,
  email,
  userId,
}: {
  taller: Taller;
  email: string;
  userId: string;
}) {
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState(taller.fotoUrl);
  const [subiendo, setSubiendo] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function guardar() {
    if (!formRef.current) return;
    setGuardando(true);
    setError(null);
    const fd = new FormData(formRef.current);
    const res = await actualizarTaller({
      nombre: String(fd.get("nombre") ?? "").trim(),
      whatsapp: String(fd.get("whatsapp") ?? "").trim(),
      ciudad: String(fd.get("ciudad") ?? "").trim(),
      direccion: String(fd.get("direccion") ?? "").trim(),
      descripcion: String(fd.get("descripcion") ?? "").trim(),
    });
    if (res.error) {
      setError(res.error);
      setGuardando(false);
      return;
    }
    setGuardando(false);
    setEditando(false);
  }

  async function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    setError(null);

    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${userId}/foto.${ext}`; // carpeta = auth.uid() (policy Storage)

    const { error: upErr } = await supabase.storage
      .from("talleres")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (upErr) {
      setError("No se pudo subir la imagen.");
      setSubiendo(false);
      return;
    }

    const { data } = supabase.storage.from("talleres").getPublicUrl(path);
    const urlVersionada = `${data.publicUrl}?v=${file.size}-${file.lastModified}`;
    const res = await actualizarFotoTaller(urlVersionada);
    if (res.error) setError(res.error);
    else setFotoUrl(urlVersionada);
    setSubiendo(false);
  }

  return (
    <div className="flex flex-col gap-md">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground-primary">
          Información del taller
        </h1>
        <p className="font-body text-foreground-secondary">
          Administra los datos de tu negocio y publícalos en el marketplace.
        </p>
      </div>

      {/* Foto / logo */}
      <div className="flex items-center gap-md rounded-2xl border border-border-subtle bg-surface-card p-lg">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-page">
          {fotoUrl && (
            <Image src={fotoUrl} alt={taller.nombre} fill className="object-cover" sizes="80px" />
          )}
        </div>
        <div>
          <p className="font-heading text-sm font-bold text-foreground-primary">
            Foto del taller
          </p>
          <p className="mb-sm font-caption text-xs text-foreground-secondary">
            Se muestra en el marketplace. JPG o PNG.
          </p>
          <label
            className={cn(
              "inline-flex cursor-pointer items-center gap-xs rounded-lg border border-border-primary px-md py-2 font-body text-sm font-semibold text-foreground-primary transition-colors hover:bg-black/5",
              subiendo && "pointer-events-none opacity-50"
            )}
          >
            <Upload size={16} /> {subiendo ? "Subiendo…" : "Cambiar foto"}
            <input type="file" accept="image/*" className="hidden" onChange={subirFoto} />
          </label>
        </div>
      </div>

      {/* Datos del negocio */}
      <form ref={formRef} className="rounded-2xl border border-border-subtle bg-surface-card p-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground-primary">
            Datos del negocio
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditando((v) => !v)}
          >
            <Pencil size={14} /> {editando ? "Cancelar" : "Editar"}
          </Button>
        </div>

        <div className="grid gap-md sm:grid-cols-2">
          <FormField label="Nombre del taller">
            <Input name="nombre" defaultValue={taller.nombre} disabled={!editando}
              className={cn(!editando && "bg-surface-page")} />
          </FormField>
          <FormField label="Correo (no editable)">
            <Input defaultValue={email} disabled className="bg-surface-page" />
          </FormField>
          <FormField label="Teléfono / WhatsApp">
            <Input name="whatsapp" defaultValue={taller.whatsapp} disabled={!editando}
              className={cn(!editando && "bg-surface-page")} />
          </FormField>
          <FormField label="Ciudad">
            <Input name="ciudad" defaultValue={taller.ubicacion.ciudad} disabled={!editando}
              className={cn(!editando && "bg-surface-page")} />
          </FormField>
          <FormField label="Dirección" className="sm:col-span-2">
            <Input name="direccion" defaultValue={taller.ubicacion.direccion} disabled={!editando}
              className={cn(!editando && "bg-surface-page")} />
          </FormField>
          <FormField label="Descripción" className="sm:col-span-2">
            <Textarea name="descripcion" defaultValue={taller.descripcion} disabled={!editando}
              className={cn(!editando && "bg-surface-page")} />
          </FormField>
        </div>

        {/* Especialidades (solo lectura por ahora) */}
        <div className="mt-lg">
          <p className="mb-sm font-caption text-sm font-semibold text-foreground-primary">
            Servicios que ofreces
          </p>
          <div className="flex flex-wrap gap-xs">
            {taller.especialidades.map((e) => (
              <Tag key={e}>{especialidadMeta(e).label}</Tag>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-md rounded-lg bg-emergency/10 px-md py-2.5 font-caption text-sm text-emergency">
            {error}
          </p>
        )}

        {editando && (
          <div className="mt-lg flex justify-end gap-sm">
            <Button type="button" variant="ghost" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="primary" disabled={guardando} onClick={guardar}>
              {guardando ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
