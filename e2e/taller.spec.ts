import { test, expect } from "@playwright/test";

/**
 * Flujo completo del taller: registro → login (redirect a panel) →
 * panel de cuenta con datos reales → logout. Serial.
 */

const stamp = Date.now();
const EMAIL = `e2e.taller.${stamp}@mecaweb.mx`;
const PASSWORD = "Prueba1234!";
const NOMBRE_TALLER = `E2E Taller ${stamp}`;

test.describe.serial("Flujo taller", () => {
  test("registro de taller", async ({ page }) => {
    await page.goto("/registro/taller");

    await page.getByLabel("Nombre del taller").fill(NOMBRE_TALLER);
    await page.getByLabel("Nombre del contacto").fill("Contacto E2E");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Teléfono / WhatsApp").fill("+52 55 0000 0002");
    await page.getByLabel("Ciudad").fill("Ciudad de México");
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByLabel("Dirección").fill("Calle Falsa 123, Col. Centro");
    await page.getByRole("button", { name: "Motor", exact: true }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Crear cuenta de taller" }).click();

    await expect(page).toHaveURL(/\/confirmacion\?tipo=taller/);
  });

  test("login de taller redirige al panel", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();

    // Rol taller → directo al panel de solicitudes
    await expect(page).toHaveURL(/\/panel\/solicitudes/);
  });

  test("panel de cuenta muestra el taller recién creado", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/panel\/solicitudes/);

    await page.goto("/panel/cuenta");
    // El formulario viene pre-llenado con los datos del registro
    await expect(page.locator('input[name="nombre"]')).toHaveValue(
      NOMBRE_TALLER
    );
  });

  test("logout", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/panel\/solicitudes/);

    // El botón dice "Salir" pero su aria-label es "Cerrar sesión"
    await page.getByRole("button", { name: "Cerrar sesión" }).click();
    await expect(
      page.getByRole("link", { name: "Iniciar sesión" })
    ).toBeVisible();
  });
});
