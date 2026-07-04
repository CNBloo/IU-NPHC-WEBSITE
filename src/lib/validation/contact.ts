import { z } from "zod";

/** Minimum seconds between form render and submission — anything faster is almost certainly a bot. */
export const MIN_SUBMIT_SECONDS = 3;

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, "");

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .transform(stripHtml),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(200, "Email is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long")
    .transform(stripHtml),
  // Honeypot — real users never see or fill this field (see ContactForm.tsx).
  company: z.string().optional().default(""),
  // Client-recorded ms-since-epoch timestamp of when the form was rendered.
  renderedAt: z.coerce.number(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
