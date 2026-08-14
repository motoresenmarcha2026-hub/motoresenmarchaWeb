import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

/**
 * Flujo completo del admin: registra un usuario e2e, lo promueve a admin
 * con la service role key (equivalente al UPDATE de 0004_admin.sql) y
 * verifica el panel /admin. Serial.
 */

const stamp = Date.now();
const EMAIL = `e2e.admin.${stamp}@mecaweb.mx`;
const PASSWORD = "Prueba1234!";
const NOMBRE = `Admin E2E ${stamp}`;

function supabaseAdmin() {
  const env = Object.fromEntries(
    readFileSync(join(__dirname, "../.env.local"), "utf8")
      .split("\n")
      .filter((l) => l.includes("=") && !l.startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      })
  );
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

test.describe.serial("Flujo admin", () => {
  test("registro del usuario que será admin", async ({ page }) => {
    await page.goto("/registro/conductor");
    await page.getByLabel("Nombre completo").fill(NOMBRE);
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Teléfono / WhatsApp").fill("+52 55 0000 0003");
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("checkbox").check();
    await page
      .getByRole("button", { name: "Crear cuenta de conductor" })
      .click();
    await expect(page).toHaveURL(/\/confirmacion\?tipo=conductor/);
  });

  test("promoción a admin vía SQL (service role)", async () => {
    const supabase = supabaseAdmin();
    // mismo UPDATE que corre 0004_admin.sql para la cuenta real
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users.users.find((u) => u.email === EMAIL);
    expect(user).toBeTruthy();

    const { error } = await supabase
      .from("profiles")
      .update({ rol: "admin" })
      .eq("id", user!.id);
    expect(error).toBeNull();
  });

  test("login de admin redirige a /admin", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("el resumen muestra los datos de toda la plataforma", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await expect(
      page.getByRole("heading", { name: "Resumen de la plataforma" })
    ).toBeVisible();

    // Tarjetas de conteo
    for (const stat of [
      "Conductores",
      "Talleres",
      "Solicitudes",
      "Citas",
      "Reseñas",
    ]) {
      await expect(page.getByText(stat, { exact: true })).toBeVisible();
    }

    // Secciones de revisión (RLS admin: puede leer solicitudes/citas ajenas)
    for (const seccion of [
      "Últimas solicitudes",
      "Últimas citas",
      "Talleres (por calificación)",
      "Últimas reseñas",
      "Usuarios recientes",
    ]) {
      await expect(
        page.getByRole("heading", { name: seccion })
      ).toBeVisible();
    }

    // Ve talleres reales del seed
    await expect(page.getByText("Taller El Rápido").first()).toBeVisible();
  });

  test("limpieza de demo: arma la confirmación y cancela (sin ejecutar)", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await expect(
      page.getByRole("heading", { name: "Datos de demostración" })
    ).toBeVisible();

    // Dos pasos: armar → cancelar. NUNCA se hace clic en el botón rojo final.
    await page
      .getByRole("button", { name: "Eliminar datos de demostración" })
      .click();
    await expect(
      page.getByText("¿Seguro? Esta acción no se puede deshacer.")
    ).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(
      page.getByRole("button", { name: "Eliminar datos de demostración" })
    ).toBeVisible();
  });

  test("mi cuenta de admin muestra datos reales", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto("/admin/cuenta");
    await expect(page.getByText(NOMBRE).first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveValue(EMAIL);
    await expect(page.locator('input[value="Administrador"]')).toBeVisible();
  });

  test("logout del admin", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.getByRole("button", { name: "Cerrar sesión" }).click();
    await expect(
      page.getByRole("link", { name: "Iniciar sesión" })
    ).toBeVisible();
  });
});
