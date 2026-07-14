import { expect, test } from "@playwright/test";

// The server action rejects submissions faster than MIN_SUBMIT_SECONDS (3s)
// as bot traffic, so human-path tests idle past the gate before submitting.
const HUMAN_DELAY_MS = 3_500;

test.describe("contact form", () => {
  test("valid submission without Resend configured shows the friendly failure", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Playwright Tester");
    await page.getByLabel("Email").fill("tester@example.com");
    await page
      .getByLabel("Message")
      .fill("This is an end-to-end test message, please ignore.");

    await page.waitForTimeout(HUMAN_DELAY_MS);
    await page.getByRole("button", { name: "Send Message" }).click();

    // CI deliberately runs with RESEND_API_KEY unset: the graceful-
    // degradation path must surface an inline error, never a crash. (The
    // filter excludes Next's empty route-announcer, which is also an alert.)
    await expect(
      page
        .getByRole("alert")
        .filter({ hasText: "Something went wrong sending your message" }),
    ).toBeVisible();
    // The user's input survives the failed submit.
    await expect(page.getByLabel("Message")).toHaveValue(
      /end-to-end test message/,
    );
  });

  test("zod-level invalid email produces an accessible field error", async ({
    page,
  }) => {
    await page.goto("/contact");
    const email = page.getByLabel("Email");
    await page.getByLabel("Name").fill("Playwright Tester");
    // Passes the browser's type=email check but fails Zod's stricter rule.
    await email.fill("tester@example");
    await page
      .getByLabel("Message")
      .fill("This is an end-to-end test message, please ignore.");

    await page.waitForTimeout(HUMAN_DELAY_MS);
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAttribute("aria-describedby", "email-error");
    await expect(page.locator("#email-error")).toContainText(
      "valid email address",
    );
  });

  test("honeypot submissions get a fake success", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Bot McBotface");
    await page.getByLabel("Email").fill("bot@example.com");
    await page.getByLabel("Message").fill("Buy my product, ten characters+.");
    // Fill the visually hidden honeypot the way a naive bot would.
    await page.locator("#company").fill("Bot Industries", { force: true });

    await page.waitForTimeout(HUMAN_DELAY_MS);
    await page.getByRole("button", { name: "Send Message" }).click();

    // Bots are told "success" so they don't learn which check caught them.
    await expect(page.getByRole("status")).toContainText(
      "Thanks for reaching out",
    );
  });
});
