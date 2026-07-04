"use server";

import { headers } from "next/headers";
import { contactFormSchema, MIN_SUBMIT_SECONDS } from "@/lib/validation/contact";
import { checkRateLimit } from "@/lib/rate-limit";
import { getContactEnv } from "@/lib/env";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check your input.",
    };
  }

  const { name, email, message, company, renderedAt } = parsed.data;

  // Honeypot filled, or submitted faster than a human could type: silently
  // report success without sending anything. Telling a bot exactly which
  // check caught it just teaches it to adapt.
  const secondsSinceRender = (Date.now() - renderedAt) / 1000;
  if (company || secondsSinceRender < MIN_SUBMIT_SECONDS) {
    return { status: "success" };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(ip);
  if (!allowed) {
    return {
      status: "error",
      message: `Too many submissions — please try again in about ${retryAfterSeconds}s.`,
    };
  }

  // getContactEnv() throws if Resend isn't configured yet, and fetch can
  // throw on a network failure — both must resolve to a friendly inline
  // error, never an uncaught throw that takes down the whole request.
  try {
    const env = getContactEnv();

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      // Plain-text body only — the recipient's mail client renders this,
      // and we never want a submitted message interpreted as HTML anywhere.
      body: JSON.stringify({
        from: env.CONTACT_SENDER_EMAIL,
        to: env.CONTACT_RECIPIENT_EMAIL,
        reply_to: email,
        subject: `IU NPHC contact form: ${name}`,
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend responded with ${response.status}`);
    }
  } catch (error) {
    console.error("Contact form send failed:", error);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again later.",
    };
  }

  return { status: "success" };
}
