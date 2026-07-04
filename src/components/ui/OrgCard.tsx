"use client";

import { useState } from "react";
import type { Organization } from "@/data/organizations";

export function OrgCard({ org }: { org: Organization }) {
  const [isOpen, setIsOpen] = useState(false);
  const [primary, secondary] = org.colors;

  return (
    <div
      className="rounded-lg border border-black/10 bg-surface text-surface-foreground shadow-sm"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="overflow-hidden rounded-lg">
        <div
          className="h-2"
          style={{
            background: `linear-gradient(90deg, ${primary.hex} 50%, ${secondary.hex} 50%)`,
          }}
          aria-hidden="true"
        />

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-surface-foreground/60">
                {org.chapterDesignation} Chapter
              </p>
              <h3 className="mt-1 text-lg font-semibold">{org.orgName}</h3>
            </div>

            {org.status === "inactive" ? (
              <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                Inactive
              </span>
            ) : null}
          </div>

          {org.statusNote ? (
            <p className="mt-2 text-sm text-surface-foreground/70">
              {org.statusNote}
            </p>
          ) : null}

          <div className="mt-4 flex items-center gap-3">
            {org.colors.map((color) => (
              <div key={color.label} className="flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/15"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                <span className="text-xs text-surface-foreground/70">
                  {color.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-surface-foreground/70">
            Founded {org.nationalFounded.date} at {org.nationalFounded.location}
          </p>

          <button
            type="button"
            className="mt-4 block text-sm font-medium text-brand underline decoration-dotted underline-offset-2"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            onFocus={() => setIsOpen(true)}
          >
            {isOpen ? "Hide chapter details" : "Chapter details"}
          </button>

          {isOpen ? (
            <div className="mt-4 space-y-4 border-t border-black/10 pt-4 text-sm">
              <div>
                <p className="font-semibold text-surface-foreground">
                  National Founders
                </p>
                <p className="mt-1 max-h-32 overflow-y-auto text-surface-foreground/70">
                  {org.nationalFounded.founders.join(", ")}
                </p>
              </div>

              <div>
                <p className="font-semibold text-surface-foreground">
                  {org.chapterDesignation} Chapter at IU
                </p>
                {org.iuChartered ? (
                  <p className="mt-1 text-surface-foreground/70">
                    Chartered {org.iuChartered.date}.{" "}
                    {org.iuChartered.note ?? ""}
                  </p>
                ) : (
                  <p className="mt-1 text-surface-foreground/70">
                    Exact charter date not yet documented on this site &mdash;
                    chapter officers can add it in Sanity.
                  </p>
                )}
              </div>

              <div>
                <p className="font-semibold text-surface-foreground">
                  Colors
                </p>
                <ul className="mt-1 text-surface-foreground/70">
                  {org.colors.map((color) => (
                    <li key={color.label}>
                      {color.label} ({color.hex})
                      {color.source === "approximate" ? " — approximate" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <a
            href={org.officialSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-sm font-medium text-brand hover:underline"
          >
            Official national website ↗
          </a>
        </div>
      </div>
    </div>
  );
}
