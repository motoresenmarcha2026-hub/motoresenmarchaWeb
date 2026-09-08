"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Package, ImageOff } from "lucide-react";
import { formatearPrecio } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField, Input, Textarea, inputBaseClass } from "@/components/ui/FormField";
import { Tag } from "@/components/ui/Tag";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIAS_REFACCION, categoriaMeta } from "@/features/refacciones/mock";
import {
  crearRefaccion,
  actualizarRefaccion,
  eliminarRefaccion,
  actualizarFotoRefaccion,
} from "@/features/refacciones/actions";
import type { Refaccion } from "@/features/refacciones/types";

interface FormState {
  nombre: string;
  categoria: string;
  precio: string;
  stock: string;
  marca: string;
  modeloCompatible: string;
  descripcion: string;
  activo: boolean;
}

const FORM_VACIO: FormState = {
  nombre: "",
  categoria: CATEGORIAS_REFACCION[0]?.key ?? "",
  precio: "",
  stock: "0",
  marca: "",
  modeloCompatible: "",
  descripcion: "",
  activo: true,
};

/** Inventario del vendedor: alta/edición/baja de refacciones con foto. */
export function InventarioRefacciones({
  refacciones,
  userId,
}: {
  refacciones: Refaccion[];
  userId: string;
}) {
  const router = useRouter();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Refaccion | null>(null);
  const [form, setForm] = useState<FormState>(FORM_VACIO);
  const [file, setFile] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [borrandoId, setBorrandoId] = useState<string | null>(null);

  function abrirNueva() {
    setEditando(null);
    setForm(FORM_VACIO);
    setFile(null);
    setError(null);
    setModalAbierto(true);
  }

  function abrirEditar(r: Refaccion) {
    setEditando(r);
    setForm({
      nombre: r.nombre,
      categoria: r.categoria || (CATEGORIAS_REFACCION[0]?.key ?? ""),
      precio: String(r.precio ?? ""),
      stock: String(r.stock ?? 0),
      marca: r.marca,
      modeloCompatible: r.modeloCompatible,
      descripcion: r.descripcion,
      activo: r.activo,
    });
    setFile(null);
    setError(null);
    setModalAbierto(true);
  }

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function subirFoto(id: string, f: File): Promise<string | null> {
    const supabase = createClient();
    const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${userId}/${id}.${ext}`; // carpeta = auth.uid() (policy Storage)
    const { error: upErr } = await supabase.storage
      .from("refacciones")
      .upload(path, f, { upsert: true, cacheControl: "3600" });
    if (upErr) return "No se pudo subir la imagen.";
    const { data } = supabase.storage.from("refacciones").getPublicUrl(path);
    const url = `${data.publicUrl}?v=${f.size}-${f.lastModified}`;
    const res = await actualizarFotoRefaccion(id, url);
    return res.error ?? null;
  }

  async function guardar() {
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setGuardando(true);
    setError(null);

    const payload = {
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      precio: Number(form.precio) || 0,
      stock: Number(form.stock) || 0,
      marca: form.marca.trim(),
      modeloCompatible: form.modeloCompatible.trim(),
      descripcion: form.descripcion.trim(),
      activo: form.activo,
    };

    let id = editando?.id;
    if (editando) {
      const res = await actualizarRefaccion(editando.id, payload);
      if (res.error) {
        setError(res.error);
        setGuardando(false);
        return;
      }
    } else {
      const res = await crearRefaccion(payload);
      if (res.error || !res.id) {
        setError(res.error ?? "No se pudo crear la refacción.");
        setGuardando(false);
        return;
      }
      id = res.id;
    }

    if (file && id) {
      const err = await subirFoto(id, file);
      if (err) {
        setError(err);
        setGuardando(false);
        return;
      }
    }

    setGuardando(false);
    setModalAbierto(false);
    router.refresh();
  }

  async function borrar(id: string) {
    setBorrandoId(id);
    const res = await eliminarRefaccion(id);
    setBorrandoId(null);
    if (!res.error) router.refresh();
  }

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-wrap items-center justify-between gap-sm">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground-primary">
            Mis refacciones
          </h1>
          <p className="font-body text-foreground-secondary">
            Administra tu catálogo de autopartes.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={abrirNueva}>
          <Plus size={18} /> Nueva refacción
        </Button>
      </div>

      {refacciones.length === 0 ? (
        <EstadoVacio
          icono={Package}
          titulo="Aún no tienes refacciones"
          descripcion="Publica tu primera autoparte para que aparezca en el marketplace."
        />
      ) : (
        <ul className="flex flex-col gap-sm">
          {refacciones.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-md rounded-2xl border border-border-subtle bg-surface-card p-md"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-page">
                {r.fotoUrl ? (
                  <Image src={r.fotoUrl} alt={r.nombre} fill className="object-cover" sizes="64px" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-foreground-secondary">
                    <ImageOff size={20} />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-xs">
                  <p className="font-heading font-bold text-foreground-primary">
                    {r.nombre}
                  </p>
                  {r.categoria && <Tag>{categoriaMeta(r.categoria).label}</Tag>}
                  {!r.activo && (
                    <span className="rounded-full bg-surface-page px-sm py-0.5 font-caption text-xs text-foreground-secondary">
                      Inactiva
                    </span>
                  )}
                </div>
                <p className="font-caption text-sm text-foreground-secondary">
                  {formatearPrecio(r.precio)}
                  {r.marca && ` · ${r.marca}`} ·{" "}
                  {r.stock > 0 ? `${r.stock} en stock` : "Sin stock"}
                </p>
              </div>

              {borrandoId === r.id ? (
                <span className="font-caption text-sm text-foreground-secondary">
                  Eliminando…
                </span>
              ) : (
                <div className="flex items-center gap-xs">
                  <Button type="button" variant="outline" size="sm" onClick={() => abrirEditar(r)}>
                    <Pencil size={14} /> Editar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Eliminar ${r.nombre}`}
                    className="text-emergency hover:bg-emergency/10"
                    onClick={() => borrar(r.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <Modal
        abierto={modalAbierto}
        onCerrar={() => !guardando && setModalAbierto(false)}
        titulo={editando ? "Editar refacción" : "Nueva refacción"}
      >
        <div className="flex flex-col gap-md">
          <div className="grid gap-md sm:grid-cols-2">
            <FormField label="Nombre" htmlFor="r-nombre" required className="sm:col-span-2">
              <Input
                id="r-nombre"
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                placeholder="Ej. Balatas delanteras cerámicas"
              />
            </FormField>
            <FormField label="Categoría" htmlFor="r-categoria">
              <select
                id="r-categoria"
                value={form.categoria}
                onChange={(e) => set("categoria", e.target.value)}
                className={inputBaseClass}
              >
                {CATEGORIAS_REFACCION.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Marca" htmlFor="r-marca">
              <Input
                id="r-marca"
                value={form.marca}
                onChange={(e) => set("marca", e.target.value)}
                placeholder="Ej. Bosch"
              />
            </FormField>
            <FormField label="Precio (MXN)" htmlFor="r-precio" required>
              <Input
                id="r-precio"
                type="number"
                min={0}
                step="0.01"
                value={form.precio}
                onChange={(e) => set("precio", e.target.value)}
                placeholder="0.00"
              />
            </FormField>
            <FormField label="Stock" htmlFor="r-stock">
              <Input
                id="r-stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
              />
            </FormField>
            <FormField label="Modelos compatibles" htmlFor="r-modelo" className="sm:col-span-2">
              <Input
                id="r-modelo"
                value={form.modeloCompatible}
                onChange={(e) => set("modeloCompatible", e.target.value)}
                placeholder="Ej. Nissan Versa 2012–2019"
              />
            </FormField>
            <FormField label="Descripción" htmlFor="r-desc" className="sm:col-span-2">
              <Textarea
                id="r-desc"
                value={form.descripcion}
                onChange={(e) => set("descripcion", e.target.value)}
                placeholder="Detalles, condición, garantía…"
              />
            </FormField>
            <FormField label="Foto" htmlFor="r-foto" className="sm:col-span-2">
              <input
                id="r-foto"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full font-caption text-sm text-foreground-secondary file:mr-md file:rounded-lg file:border-0 file:bg-surface-page file:px-md file:py-2 file:font-body file:text-sm file:font-semibold file:text-foreground-primary"
              />
            </FormField>
          </div>

          <label className="flex cursor-pointer items-center gap-sm font-caption text-sm text-foreground-secondary">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => set("activo", e.target.checked)}
              className="h-5 w-5 accent-action-primary"
            />
            <span>Visible en el marketplace (activa)</span>
          </label>

          {error && (
            <p className="rounded-lg bg-emergency/10 px-md py-2.5 font-caption text-sm text-emergency">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-sm">
            <Button type="button" variant="ghost" onClick={() => setModalAbierto(false)} disabled={guardando}>
              Cancelar
            </Button>
            <Button type="button" variant="primary" onClick={guardar} disabled={guardando}>
              {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Crear refacción"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
