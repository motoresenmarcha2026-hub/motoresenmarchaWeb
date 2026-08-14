import { test, expect } from "@playwright/test";

/** Flujos públicos: no requieren sesión. */

test.describe("Home", () => {
  test("carga con hero y talleres destacados desde la DB", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Ayuda mecánica confiable/ })
    ).toBeVisible();
    // Talleres destacados del seed (leídos de Supabase)
    await expect(page.getByText("Taller El Rápido").first()).toBeVisible();
  });
});

test.describe("Marketplace /talleres", () => {
  test("lista talleres de la DB con imágenes de Storage", async ({ page }) => {
    await page.goto("/talleres");
    await expect(page.getByText(/\d+ talleres encontrados/)).toBeVisible();
    await expect(page.getByText("Taller El Rápido").first()).toBeVisible();

    // Al menos una imagen debe venir de Supabase Storage (no picsum)
    const srcs = await page
      .locator("img")
      .evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).src));
    expect(srcs.some((s) => s.includes("supabase.co"))).toBe(true);
    expect(srcs.some((s) => s.includes("picsum.photos"))).toBe(false);
  });

  test("filtra por especialidad", async ({ page }) => {
    await page.goto("/talleres");
    // El contador es plural o singular según el resultado
    const contador = page.getByText(/\d+ taller(es)? encontrados?/);
    const totalTexto = (await contador.textContent()) ?? "0";
    const total = parseInt(totalTexto, 10);
    expect(total).toBeGreaterThan(1);

    await page.getByRole("button", { name: "Transmisión" }).click();
    await expect(contador).not.toHaveText(totalTexto);
    // Transmisiones González ofrece transmisión
    await expect(page.getByText("Transmisiones González")).toBeVisible();
  });
});

test.describe("Perfil de taller", () => {
  test("muestra datos completos de la DB", async ({ page }) => {
    await page.goto("/talleres/t1");
    await expect(
      page.getByRole("heading", { name: "Taller El Rápido" })
    ).toBeVisible();
    await expect(page.getByText("Carlos Medina").first()).toBeVisible();
    await expect(page.getByText("Disponibilidad")).toBeVisible();
  });
});

test.describe("Solicitar servicio", () => {
  test("resumen carga el taller desde la DB y habilita WhatsApp al completar", async ({
    page,
    context,
  }) => {
    await page.goto("/solicitar?taller=t1");

    // El taller viene de la DB (Fase 6: sin mock)
    await expect(page.getByText("Resumen de la solicitud")).toBeVisible();
    await expect(page.getByText("Taller El Rápido")).toBeVisible();

    // El CTA es un <a>: sin href + aria-disabled mientras falta info
    const ctaWA = page.getByText("Enviar por WhatsApp");
    await expect(ctaWA).toHaveAttribute("aria-disabled", "true");

    // Elegir tipo + ubicación lo habilita (gana href → rol link)
    await page.getByRole("button", { name: "Motor", exact: true }).click();
    await page
      .getByPlaceholder("Dirección o referencia")
      .fill("Av. Insurgentes 100, CDMX");
    const linkWA = page.getByRole("link", { name: "Enviar por WhatsApp" });
    await expect(linkWA).toHaveAttribute("href", /wa\.me/);

    // Clic abre wa.me en pestaña nueva
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      linkWA.click(),
    ]);
    // wa.me redirige a api.whatsapp.com
    expect(popup.url()).toMatch(/wa\.me|whatsapp\.com/);
    await popup.close();
  });
});

test.describe("Páginas legales", () => {
  const PAGINAS = [
    { ruta: "/terminos", titulo: "Términos y condiciones" },
    { ruta: "/privacidad", titulo: "Aviso de privacidad" },
    { ruta: "/cookies", titulo: "Política de cookies" },
  ];
  for (const { ruta, titulo } of PAGINAS) {
    test(`${ruta} carga con su contenido`, async ({ page }) => {
      await page.goto(ruta);
      await expect(
        page.getByRole("heading", { level: 1, name: titulo })
      ).toBeVisible();
      await expect(page.getByText(/Última actualización/)).toBeVisible();
    });
  }

  test("el footer enlaza a las tres páginas", async ({ page }) => {
    await page.goto("/");
    for (const { titulo } of PAGINAS.slice(0, 2)) {
      await expect(
        page.getByRole("link", { name: new RegExp(titulo, "i") })
      ).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "Cookies" })).toBeVisible();
  });
});

test.describe("Protección de rutas (proxy)", () => {
  for (const ruta of ["/citas/agendar/t1", "/panel/solicitudes", "/cuenta"]) {
    test(`${ruta} sin sesión redirige a /login con next`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page).toHaveURL(
        new RegExp(`/login\\?next=${encodeURIComponent(ruta)}`)
      );
      await expect(
        page.getByRole("button", { name: "Entrar" })
      ).toBeVisible();
    });
  }
});
