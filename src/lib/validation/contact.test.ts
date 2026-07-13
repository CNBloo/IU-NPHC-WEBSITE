import { describe, expect, it } from "vitest";
import { contactFormSchema } from "./contact";

const validInput = {
  name: "Jordan Rivera",
  email: "jordan@example.com",
  message: "I'd like to learn more about NPHC intake at IU.",
  company: "",
  renderedAt: "1750000000000",
};

describe("contactFormSchema", () => {
  it("accepts a valid submission and coerces renderedAt to a number", () => {
    const parsed = contactFormSchema.parse(validInput);
    expect(parsed.name).toBe("Jordan Rivera");
    expect(parsed.renderedAt).toBe(1750000000000);
  });

  it("trims surrounding whitespace on name, email, and message", () => {
    const parsed = contactFormSchema.parse({
      ...validInput,
      name: "  Jordan Rivera  ",
      email: "  jordan@example.com  ",
      message: `  ${validInput.message}  `,
    });
    expect(parsed.name).toBe("Jordan Rivera");
    expect(parsed.email).toBe("jordan@example.com");
    expect(parsed.message).toBe(validInput.message);
  });

  it("strips HTML tags from name and message", () => {
    const parsed = contactFormSchema.parse({
      ...validInput,
      name: "Jordan <script>alert(1)</script>Rivera",
      message: "Hello <b>there</b>, tell me about intake please.",
    });
    expect(parsed.name).toBe("Jordan alert(1)Rivera");
    expect(parsed.message).toBe("Hello there, tell me about intake please.");
  });

  it("defaults the honeypot field to an empty string when absent", () => {
    const { company: _company, ...withoutHoneypot } = validInput;
    const parsed = contactFormSchema.parse(withoutHoneypot);
    expect(parsed.company).toBe("");
  });

  it.each([
    ["empty name", { name: "" }],
    ["whitespace-only name", { name: "   " }],
    ["name over 100 chars", { name: "a".repeat(101) }],
    ["invalid email", { email: "not-an-email" }],
    ["email over 200 chars", { email: `${"a".repeat(195)}@example.com` }],
    ["message under 10 chars", { message: "too short" }],
    ["message over 2000 chars", { message: "a".repeat(2001) }],
    ["missing renderedAt", { renderedAt: undefined }],
    ["non-numeric renderedAt", { renderedAt: "yesterday" }],
  ])("rejects %s", (_label, overrides) => {
    const result = contactFormSchema.safeParse({ ...validInput, ...overrides });
    expect(result.success).toBe(false);
  });
});
