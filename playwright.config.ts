import { defineConfig } from "@playwright/test";

// Next's own dev/build server auto-loads .env.local, but this config file
// runs in the bare Playwright test process, which doesn't — load it here so
// smoke.spec.ts's direct Sanity reads see the same vars locally. CI sets
// these as real env vars via the workflow, so there's no .env.local there.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local (e.g. in CI) — fine, env vars come from the environment.
}

// The suite runs against a real production build (`next build && next
// start`) rather than the dev server, so CSP, static generation, and
// hydration behave exactly as they will in deployment.
export default defineConfig({
  testDir: "./e2e",
  retries: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3100",
  },
  webServer: {
    command: "npm run build && npm run start -- --port 3100",
    url: "http://localhost:3100",
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
