/**
 * Reemplaza las fotos aleatorias del seed por imágenes automotrices de
 * Unsplash (revisadas manualmente) y avatares de iniciales (ui-avatars).
 * Sube a Storage y actualiza foto_url / avatar_url (+cache-bust ?v=2).
 *
 * Uso: node scripts/update-seed-images.mjs
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const unsplash = (id) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80`;
const uiAvatar = (nombre) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&size=150&background=1F2937&color=fff&bold=true&format=png`;

/** Foto elegida por especialidad del taller (todas verificadas visualmente). */
const TALLERES = [
  { id: "t1", nombre: "Carlos Medina", foto: "1625047509168-a7026f36de04" }, // mecánico con cofre abierto
  { id: "t2", nombre: "Ana Delgado", foto: "1487754180451-c456f719a1fc" }, // servicio de aceite
  { id: "t3", nombre: "Ricardo Torres", foto: "1530046339160-ce3e530c7d2f" }, // pared de herramientas
  { id: "t4", nombre: "Miguel Ángel Ruiz", foto: "1619642751034-765dfdf7c58e" }, // manos con llave en motor
  { id: "t5", nombre: "Fernando González", foto: "1486262715619-67b85e0b08d3" }, // motor bandas/poleas
  { id: "t6", nombre: "Laura Jiménez", foto: "1449965408869-eaa3f722e40d" }, // tablero interior
  { id: "t7", nombre: "José Cruz", foto: "1552519507-da3b142c6e3d" }, // auto con rines/llantas
  { id: "t8", nombre: "Diana Salas", foto: "1492144534655-ae79c964c9d7" }, // garage moderno
];

const RESENAS_AUTORES = [
  "Sofía R.",
  "Pedro M.",
  "Gabriela N.",
  "Luis T.",
  "Marcela V.",
];

const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function upload(path, buffer, contentType) {
  const { error } = await supabase.storage
    .from("talleres")
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw new Error(`upload ${path}: ${error.message}`);
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/talleres/${path}?v=2`;
}

for (const t of TALLERES) {
  const fotoBuf = await fetchBuffer(unsplash(t.foto));
  const fotoUrl = await upload(`${t.id}/foto.jpg`, fotoBuf, "image/jpeg");

  const avatarBuf = await fetchBuffer(uiAvatar(t.nombre));
  const avatarUrl = await upload(`${t.id}/avatar.png`, avatarBuf, "image/png");

  const { error } = await supabase
    .from("talleres")
    .update({ foto_url: fotoUrl, avatar_url: avatarUrl })
    .eq("id", t.id);
  console.log(`${t.id} ${error ? "ERROR: " + error.message : "✓ foto + avatar"}`);
}

for (const autor of RESENAS_AUTORES) {
  const buf = await fetchBuffer(uiAvatar(autor));
  const url = await upload(`resenas/${slug(autor)}.png`, buf, "image/png");
  const { error } = await supabase
    .from("resenas")
    .update({ autor_avatar_url: url })
    .eq("autor", autor);
  console.log(`reseña ${autor} ${error ? "ERROR: " + error.message : "✓ avatar"}`);
}

console.log("\nImágenes del seed actualizadas.");
