import { defineConfig, devices } from "@playwright/test";

/**
 * E2E contra el dev server local (usa .env.local → Supabase real).
 * Los tests crean usuarios e2e.*@mecaweb.mx — limpiar con el SQL de e2e/README.md.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    // 3100 para no chocar con otros dev servers en 3000
    baseURL: "http://localhost:3100",
    locale: "es-MX",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
