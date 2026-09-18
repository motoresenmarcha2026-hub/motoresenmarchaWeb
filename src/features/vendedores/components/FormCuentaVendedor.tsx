"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Pencil, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIAS_REFACCION } from "@/features/refacciones/mock";
import { actualizarVendedor, actualizarLogoVendedor } from "@/features/vendedores/actions";
import type { Vendedor } from "@/features/vendedores/types";

/** Panel de cuenta del vendedor: editar datos de la tienda + subir logo. */
export function FormCuentaVendedor({
  vendedor,
  email,
  userId,
}: {
  vendedor: Vendedor;
  email: string;
  userId: string;
}) {
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState(vendedor.logoUrl);
  const [subiendo, setSubiendo] = useState(false);
  const [categorias, setCategorias] = useState<string[]>(vendedor.categorias);
  const formRef = useRef<HTMLFormElement>(null);

  function toggleCategoria(c: string) {
    if (!editando) return;
    setCategorias((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  async function guardar() {
    if (!formRef.current) return;
    setGuardando(true);
    setError(null);
    const fd = new FormData(formRef.current);
    const res = await actualizarVendedor({
      nombreNegocio: String(fd.get("nombre_negocio") ?? "").trim(),
      whatsapp: String(fd.get("whatsapp") ?? "").trim(),
      ciudad: String(fd.get("ciudad") ?? "").trim(),
      direccion: String(fd.get("direccion") ?? "").trim(),
      descripcion: String(fd.get("descripcion") ?? "").trim(),
      categorias,
    });
    if (res.error) {
      setError(res.error);
      setGuardando(false);
      return;
    }
    setGuardando(false);
    setEditando(false);
  }

  async function subirLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    setError(null);

    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${userId}/logo.${ext}`; // carpeta = auth.uid() (policy Storage)

    const { error: upErr } = await supabase.storage
      .from("refacciones")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (upErr) {
      setError("No se pudo subir la imagen.");
      setSubiendo(false);
      return;
    }

    const { data } = supabase.storage.from("refacciones").getPublicUrl(path);
    const urlVersionada = `${data.publicUrl}?v=${file.size}-${file.lastModified}`;
    const res = await actualizarLogoVendedor(urlVersionada);
    if (res.error) setError(res.error);
    else setLogoUrl(urlVersionada);
    setSubiendo(false);
  }

  return (
    <div className="flex flex-col gap-md">
      <div>
        <h1 className="font-heading text-2xl font-extrabold uppercase text-foreground-primary">
          Información del negocio
        </h1>
        <p className="font-body text-foreground-secondary">
          Administra los datos de tu refaccionaria y publícalos en el marketplace.
        </p>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-md border-2 border-border-primary bg-surface-card p-lg">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden border-2 border-border-primary bg-surface-page">
          {logoUrl && (
            <Image src={logoUrl} alt={vendedor.nombreNegocio} fill className="object-cover" sizes="80px" />
          )}
        </div>
        <div>
          <p className="font-heading text-sm font-extrabold uppercase text-foreground-primary">
            Logo del negocio
          </p>
          <p className="mb-sm font-body text-xs text-foreground-secondary">
            Se muestra en tus refacciones. JPG o PNG.
          </p>
          <label
            className={cn(
              "inline-flex cursor-pointer items-center gap-xs rounded-none border-2 border-border-primary px-md py-2 font-body text-sm font-semibold text-foreground-primary transition-colors hover:bg-surface-page",
              subiendo && "pointer-events-none opacity-50"
            )}
          >
            <Upload size={16} /> {subiendo ? "Subiendo…" : "Cambiar logo"}
            <input type="file" accept="image/*" className="hidden" onChange={subirLogo} />
          </label>
        </div>
      </div>

      {/* Datos del negocio */}
      <form ref={formRef} className="border-2 border-border-primary bg-surface-card p-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-heading text-lg font-extrabold uppercase text-foreground-primary">
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
          <FormField label="Nombre del negocio">
            <Input name="nombre_negocio" defaultValue={vendedor.nombreNegocio} disabled={!editando}
              className={cn(!editando && "bg-surface-page")} />
          </FormField>
          <FormField label="Correo (no editable)">
            <Input defaultValue={email} disabled className="bg-surface-page" />
          </FormField>
          <FormField label="Teléfono / WhatsApp">
            <Input name="whatsapp" defaultValue={vendedor.whatsapp} disabled={!editando}
              className={cn(!editando && "bg-surface-page")} />
          </FormField>
          <FormField label="Ciudad">
            <Input name="ciudad" defaultValue={vendedor.ciudad} disabled={!editando}
              className={cn(!editando && "bg-surface-page")} />
          </FormField>
          <FormField label="Dirección" className="sm:col-span-2">
            <Input name="direccion" defaultValue={vendedor.direccion} disabled={!editando}
              className={cn(!editando && "bg-surface-page")} />
          </FormField>
          <FormField label="Descripción" className="sm:col-span-2">
            <Textarea name="descripcion" defaultValue={vendedor.descripcion} disabled={!editando}
              className={cn(!editando && "bg-surface-page")} />
          </FormField>
        </div>

        {/* Categorías (editables en modo edición) */}
        <div className="mt-lg">
          <p className="mb-sm font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-primary">
            Categorías que vendes
          </p>
          <div className="flex flex-wrap gap-xs">
            {CATEGORIAS_REFACCION.map((c) => {
              const activo = categorias.includes(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => toggleCategoria(c.key)}
                  disabled={!editando}
                  className={cn(
                    "inline-flex h-11 items-center rounded-none border-2 px-md font-heading text-xs font-extrabold uppercase tracking-[0.1em] transition-colors",
                    activo
                      ? "border-action-primary bg-action-primary text-foreground-inverse"
                      : "border-border-primary bg-surface-card text-foreground-secondary",
                    editando ? "cursor-pointer hover:border-foreground-secondary" : "cursor-default opacity-90"
                  )}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="mt-md border-2 border-emergency-dark bg-surface-card px-md py-2.5 font-body text-sm font-semibold text-emergency-dark">
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
