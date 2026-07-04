import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | IU National Pan-Hellenic Council",
  description: "Get in touch with the IU National Pan-Hellenic Council.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Contact Us
      </h1>
      <p className="mt-4 text-foreground/80">
        Have a general question for the council? Send us a message below. If
        you&rsquo;re interested in joining a specific organization, reach out
        to that chapter directly from its page on{" "}
        <a href="/organizations" className="text-brand underline">
          Member Organizations
        </a>
        .
      </p>

      <div className="mt-10">
        <ContactForm />
      </div>

      <section className="mt-10 border-t border-black/10 pt-8">
        <h2 className="text-xl font-semibold text-foreground">Follow Us</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Social links will appear here once they&rsquo;re added in the CMS.
        </p>
      </section>
    </div>
  );
}
