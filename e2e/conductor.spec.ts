import { test, expect } from "@playwright/test";

/**
 * Flujo completo del conductor: registro → login → agendar cita →
 * solicitar con sesión → logout. Serial: comparten el usuario creado.
 */

const stamp = Date.now();
const EMAIL = `e2e.conductor.${stamp}@mecaweb.mx`;
const PASSWORD = "Prueba1234!";
const NOMBRE = `Conductor E2E ${stamp}`;

test.describe.serial("Flujo conductor", () => {
  test("registro de conductor", async ({ page }) => {
    await page.goto("/registro");
    await page.getByRole("link", { name: /Regístrate como conductor/ }).click();
    await expect(page).toHaveURL(/\/registro\/conductor/);

    await page.getByLabel("Nombre completo").fill(NOMBRE);
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Teléfono / WhatsApp").fill("+52 55 0000 0001");
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("checkbox").check();
    await page
      .getByRole("button", { name: "Crear cuenta de conductor" })
      .click();

    await expect(page).toHaveURL(/\/confirmacion\?tipo=conductor/);
  });

  test("login redirige a home con sesión", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "Mi cuenta" })).toBeVisible();
  });

  test("agendar cita end-to-end", async ({ page }) => {
    // login (cada test tiene contexto limpio)
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL("/");

    await page.goto("/citas/agendar/t1");
    await expect(
      page.getByRole("heading", { name: "Agendar una cita" })
    ).toBeVisible();
    // El taller viene de la DB (Fase 6)
    await expect(page.getByText(/Reserva un horario con Taller El Rápido/)).toBeVisible();

    // Servicio: primer chip de especialidad del taller
    await page.getByRole("button", { name: "Motor", exact: true }).click();

    // Hora: elegir una franja (la fecha ya trae default el primer día)
    await page.getByRole("button", { name: "10:00" }).click();

    const confirmar = page.getByRole("button", { name: "Confirmar cita" });
    await expect(confirmar).toBeEnabled();
    await confirmar.click();

    await expect(page).toHaveURL(/\/confirmacion\?tipo=solicitud/);
  });

  test("solicitar muestra el nombre real del conductor", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL("/");

    await page.goto("/solicitar?taller=t1");
    // clienteNombre viene de getPerfil() (cambio Fase 6, antes era mock);
    // aparece en la fila Cliente y en el preview del mensaje
    await expect(page.getByText(NOMBRE).first()).toBeVisible();
  });

  test("logout regresa a estado sin sesión", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL("/");

    // El botón dice "Salir" pero su aria-label es "Cerrar sesión"
    await page.getByRole("button", { name: "Cerrar sesión" }).click();
    await expect(
      page.getByRole("link", { name: "Iniciar sesión" })
    ).toBeVisible();
  });
});
