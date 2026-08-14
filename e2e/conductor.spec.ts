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

  test("mis citas muestra la cita real agendada", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL("/");

    await page.goto("/citas/mis-citas");
    // Sidebar con el perfil real, no el mock
    await expect(page.getByText(NOMBRE)).toBeVisible();
    // La cita agendada en el test anterior aparece en "Próximas"
    await expect(page.getByText("Taller El Rápido").first()).toBeVisible();
    await expect(page.getByText(/Próximas \(\d+\)/)).toHaveText(/\([1-9]\d*\)/);
  });

  test("mi cuenta muestra los datos reales del perfil", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL("/");

    await page.goto("/cuenta");
    // Sidebar con el nombre real; el email vive en un input
    await expect(page.getByText(NOMBRE).first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveValue(EMAIL);
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

  test("vehículo, solicitudes y notificaciones renderizan (reales o vacías)", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL("/");

    await page.goto("/cuenta/vehiculo");
    await expect(
      page.getByText("Aún no has registrado tu vehículo")
    ).toBeVisible();

    await page.goto("/cuenta/notificaciones");
    await expect(page.getByText("No tienes notificaciones")).toBeVisible();

    // Puede tener la solicitud del test de solicitar (fire-and-forget) o estar vacía
    await page.goto("/cuenta/solicitudes");
    await expect(
      page.getByText(/Mis solicitudes|Aún no tienes solicitudes/).first()
    ).toBeVisible();
  });

  test("conductor no puede entrar al panel admin", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(EMAIL);
    await page.getByLabel("Contraseña").fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL("/");

    // requireAdmin lo regresa a la home
    await page.goto("/admin");
    await expect(page).toHaveURL("/");
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
