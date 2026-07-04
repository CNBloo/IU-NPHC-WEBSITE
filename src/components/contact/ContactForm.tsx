"use client";

import { useActionState, useState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  );
  // Recorded once, at first render, so the server action can reject
  // submissions that happen faster than a human could plausibly type.
  const [renderedAt] = useState(() => Date.now());

  // Controlled, not uncontrolled: React clears uncontrolled fields after a
  // form action runs, which would wipe out everything the user typed the
  // moment a submission comes back as an error — losing their message on a
  // failed send is a bad experience, so these values live in state instead
  // and only get cleared on an actual success.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="rounded-lg border border-black/10 bg-surface p-6 text-surface-foreground"
      >
        Thanks for reaching out — we&rsquo;ll get back to you soon.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="renderedAt" value={renderedAt} />

      {/* Honeypot: invisible to sighted and screen-reader users, but a
          plain form field bots tend to fill in automatically. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-black/20 bg-white px-3 py-2 text-foreground"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-black/20 bg-white px-3 py-2 text-foreground"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-md border border-black/20 bg-white px-3 py-2 text-foreground"
        />
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
