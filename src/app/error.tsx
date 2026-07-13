"use client";

import { ButtonLink } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 text-foreground/80">
        An unexpected error occurred while loading this page. It has nothing to
        do with anything you did — please try again.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:opacity-90"
        >
          Try again
        </button>
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
