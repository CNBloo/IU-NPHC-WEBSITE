import Link from "next/link";
import type { Organization } from "@/lib/sanity/types";

/**
 * Listing card for an organization — the whole card is one link to the
 * chapter's detail page, so the listing stays fully server-rendered.
 */
export function OrgCard({ org }: { org: Organization }) {
  const [primary, secondary] = org.colors;

  return (
    <Link
      href={`/organizations/${org.slug}`}
      className="block rounded-lg border border-black/10 bg-surface text-surface-foreground shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="overflow-hidden rounded-lg">
        <div
          className="h-2"
          style={{
            background: secondary
              ? `linear-gradient(90deg, ${primary.hex} 50%, ${secondary.hex} 50%)`
              : primary.hex,
          }}
          aria-hidden="true"
        />

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-surface-foreground/60">
                {org.chapterDesignation} Chapter
              </p>
              <h3 className="mt-1 text-lg font-semibold">{org.name}</h3>
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

          {org.nationalFounded?.date && org.nationalFounded?.location ? (
            <p className="mt-4 text-sm text-surface-foreground/70">
              Founded {org.nationalFounded.date} at{" "}
              {org.nationalFounded.location}
            </p>
          ) : null}

          <p className="mt-4 text-sm font-medium text-brand underline decoration-dotted underline-offset-2">
            Chapter details
          </p>
        </div>
      </div>
    </Link>
  );
}
