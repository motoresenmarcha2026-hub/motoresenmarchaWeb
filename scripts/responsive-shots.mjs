/**
 * Captura de pantallas clave en iPad (768x1024) y celular (390x844)
 * para la revisión responsive. Guarda en /tmp/shots/.
 * Uso: node scripts/responsive-shots.mjs
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";

const BASE = "http://localhost:3100";
const OUT = "/tmp/shots";
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "ipad", width: 768, height: 1024 },
  { name: "movil", width: 390, height: 844 },
];

const RUTAS_PUBLICAS = [
  ["home", "/"],
  ["talleres", "/talleres"],
  ["perfil", "/talleres/t1"],
  ["solicitar", "/solicitar?taller=t1"],
  ["login", "/login"],
  ["registro", "/registro"],
  ["registro-taller", "/registro/taller"],
];

const stamp = Date.now();
const EMAIL = `e2e.responsive.${stamp}@mecaweb.mx`;
const PASSWORD = "Prueba1234!";

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.name === "movil",
    hasTouch: vp.name === "movil",
  });
  const page = await ctx.newPage();

  for (const [nombre, ruta] of RUTAS_PUBLICAS) {
    await page.goto(BASE + ruta, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `${OUT}/${vp.name}-${nombre}.png`,
      fullPage: true,
    });
  }

  // Modal de ubicación (mapa) en /talleres
  await page.goto(BASE + "/talleres", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Elegir ubicación" }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${vp.name}-modal-mapa.png` });
  await page.keyboard.press("Escape");

  // Menú móvil del header
  if (vp.name === "movil") {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const burger = page.getByRole("button", { name: /Abrir menú/ });
    if (await burger.isVisible().catch(() => false)) {
      await burger.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}/${vp.name}-menu.png` });
    }
  }

  await ctx.close();
}

// Panel con sesión (conductor): registrar una vez y capturar en ambos tamaños
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + "/registro/conductor", { waitUntil: "networkidle" });
  await page.getByLabel("Nombre completo").fill("Revisor Responsive");
  await page.getByLabel("Correo electrónico").fill(EMAIL);
  await page.getByLabel("Teléfono / WhatsApp").fill("+52 55 0000 0009");
  await page.getByLabel("Contraseña").fill(PASSWORD);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Crear cuenta de conductor" }).click();
  await page.waitForURL(/confirmacion/);
  await ctx.close();
}

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.name === "movil",
    hasTouch: vp.name === "movil",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/login", { waitUntil: "networkidle" });
  await page.getByLabel("Correo electrónico").fill(EMAIL);
  await page.getByLabel("Contraseña").fill(PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL(BASE + "/");

  for (const [nombre, ruta] of [
    ["mis-citas", "/citas/mis-citas"],
    ["cuenta", "/cuenta"],
  ]) {
    await page.goto(BASE + ruta, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `${OUT}/${vp.name}-${nombre}.png`,
      fullPage: true,
    });
  }
  await ctx.close();
}

await browser.close();
console.log("Capturas guardadas en", OUT);
