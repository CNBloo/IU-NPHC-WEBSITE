import { expect, test } from "@playwright/test";

const ROUTES: Array<{ path: string; h1: RegExp }> = [
  { path: "/", h1: /IU National Pan-Hellenic Council/ },
  { path: "/about", h1: /About NPHC/ },
  { path: "/organizations", h1: /Member Organizations/ },
  { path: "/organizations/kappa-alpha-psi", h1: /Kappa Alpha Psi/ },
  { path: "/exec-board", h1: /Executive Board/ },
  { path: "/events", h1: /Events/ },
  { path: "/resources", h1: /Resources/ },
  { path: "/contact", h1: /Contact Us/ },
];

for (const { path, h1 } of ROUTES) {
  test(`${path} renders with its h1 and a clean console`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);

    // Console errors catch hydration failures and CSP violations — the
    // strict nonce CSP makes this assertion load-bearing.
    expect(consoleErrors).toEqual([]);
  });
}

test("unknown org slug returns the branded 404", async ({ page }) => {
  const response = await page.goto("/organizations/not-a-real-org");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Page not found/,
  );
});

test("unknown route returns the branded 404", async ({ page }) => {
  const response = await page.goto("/definitely-not-a-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Page not found/,
  );
});

test("inactive chapter shows its status callout", async ({ page }) => {
  await page.goto("/organizations/kappa-alpha-psi");
  await expect(
    page.getByText("This chapter is currently inactive."),
  ).toBeVisible();
});

test("event calendar download serves an ics file", async ({ request }) => {
  const response = await request.get(
    "/events/fall-kickoff-interest-meeting/calendar",
  );
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/calendar");
  const body = await response.text();
  expect(body).toContain("BEGIN:VEVENT");
});

test("sitemap and robots respond", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("/organizations/alpha-phi-alpha");

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Disallow: /studio");
});

test("event filtering by organization narrows the list", async ({ page }) => {
  await page.goto("/events?org=omega-psi-phi");
  await expect(
    page.getByRole("heading", { name: "Step Show Showcase" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "MLK Day of Service" }),
  ).not.toBeVisible();
});
