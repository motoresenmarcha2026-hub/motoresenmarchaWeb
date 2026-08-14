/**
 * Migra las imágenes del seed (picsum.photos) a Supabase Storage.
 * Descarga cada imagen y la sube al bucket `talleres`.
 * Luego actualiza foto_url y avatar_url en la tabla `talleres`.
 *
 * Uso: node scripts/migrate-images.mjs
 * Requiere: SUPABASE_SERVICE_ROLE_KEY en .env.local
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// Leer .env.local manualmente
const envContent = readFileSync(
  new URL("../.env.local", import.meta.url).pathname,
  "utf-8"
);
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function uploadImage(buffer, path, contentType = "image/jpeg") {
  const { error } = await supabase.storage
    .from("talleres")
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw new Error(`Upload ${path}: ${error.message}`);
}

function publicUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/talleres/${path}`;
}

// Toma las URLs actuales de foto_url y avatar_url desde la tabla
const { data: talleres, error: fetchErr } = await supabase
  .from("talleres")
  .select("id, nombre, foto_url, avatar_url")
  .order("id");

if (fetchErr) {
  console.error("Error leyendo talleres:", fetchErr.message);
  process.exit(1);
}

console.log(`Migrando imágenes de ${talleres.length} talleres...\n`);

for (const taller of talleres) {
  const { id, nombre, foto_url, avatar_url } = taller;
  const updates = {};

  // Migrar foto principal (800x600) si sigue siendo picsum
  if (foto_url && foto_url.includes("picsum.photos")) {
    const fotoPath = `${id}/foto.jpg`;
    try {
      process.stdout.write(`  [${id}] ${nombre} — foto...`);
      const buf = await downloadBuffer(foto_url);
      await uploadImage(buf, fotoPath);
      updates.foto_url = publicUrl(fotoPath);
      console.log(" ✓");
    } catch (e) {
      console.log(` ✗ ${e.message}`);
    }
  }

  // Migrar avatar (150x150) si sigue siendo picsum
  if (avatar_url && avatar_url.includes("picsum.photos")) {
    const avatarPath = `${id}/avatar.jpg`;
    try {
      process.stdout.write(`  [${id}] ${nombre} — avatar...`);
      const buf = await downloadBuffer(avatar_url);
      await uploadImage(buf, avatarPath);
      updates.avatar_url = publicUrl(avatarPath);
      console.log(" ✓");
    } catch (e) {
      console.log(` ✗ ${e.message}`);
    }
  }

  // Actualizar la fila en la tabla
  if (Object.keys(updates).length > 0) {
    const { error: updateErr } = await supabase
      .from("talleres")
      .update(updates)
      .eq("id", id);
    if (updateErr) {
      console.error(`  [${id}] Error actualizando DB: ${updateErr.message}`);
    }
  }
}

console.log("\nMigración completada.");
