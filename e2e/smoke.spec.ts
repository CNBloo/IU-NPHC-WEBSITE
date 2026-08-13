import { expect, test } from "@playwright/test";

type UpcomingEventFixture = {
  slug: string;
  title: string;
  orgSlug: string | null;
};

/**
 * Reads upcoming events straight from Sanity instead of the app, since these
 * tests need to know what's *actually* live before asserting against it.
 * Events are real content officers manage every semester — hardcoding a
 * specific title/slug here would break the suite the next time someone
 * edits the calendar, so the two tests below discover fixtures at run time.
 */
async function fetchUpcomingEvents(): Promise<UpcomingEventFixture[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_READ_TOKEN;
  if (!projectId || !token) return [];

  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const apiVersion = process.env.SANITY_API_VERSION ?? "2025-01-01";
  const query = encodeURIComponent(
    `*[_type == "event" && startDateTime >= now()]{ "slug": slug.current, title, "orgSlug": organization->slug.current }`,
  );
  const response = await fetch(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) return [];

  const { result } = (await response.json()) as {
    result: UpcomingEventFixture[];
  };
  return result;
}

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
  const events = await fetchUpcomingEvents();
  test.skip(
    events.length === 0,
    "No upcoming events in the dataset to test a calendar download against.",
  );

  const response = await request.get(`/events/${events[0].slug}/calendar`);
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
  const events = await fetchUpcomingEvents();
  const target = events.find((event) => event.orgSlug);
  test.skip(
    !target,
    "No upcoming event with an organization set to test filtering against.",
  );
  const { slug: targetSlug, title, orgSlug } = target!;

  await page.goto(`/events?org=${orgSlug}`);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();

  // Any org the target event doesn't belong to should filter it out —
  // falls back to a slug that can't match if every event shares one org.
  const otherOrgSlug =
    events.find(
      (event) => event.orgSlug && event.orgSlug !== orgSlug && event.slug !== targetSlug,
    )?.orgSlug ?? "not-a-real-org-slug";
  await page.goto(`/events?org=${otherOrgSlug}`);
  await expect(page.getByRole("heading", { name: title })).not.toBeVisible();
});
