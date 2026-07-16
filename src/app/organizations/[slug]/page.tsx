import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getOrganizationBySlug,
  getOrganizations,
  getUpcomingEvents,
} from "@/lib/sanity/queries";
import { splitUpcomingAndPast } from "@/lib/dates";
import { EventCard } from "@/components/ui/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { RichText } from "@/components/ui/RichText";

export async function generateStaticParams() {
  const organizations = await getOrganizations();
  return organizations.map((org) => ({ slug: org.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) return {};
  return {
    title: org.name,
    description: `${org.name} — ${org.chapterDesignation} Chapter at Indiana University Bloomington, a member organization of the IU National Pan-Hellenic Council.`,
  };
}

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [org, organizations, allUpcoming] = await Promise.all([
    getOrganizationBySlug(slug),
    getOrganizations(),
    getUpcomingEvents(),
  ]);
  if (!org) notFound();

  const [primary, secondary] = org.colors;
  const orgIndex = organizations.findIndex((o) => o.slug === slug);
  const prev = orgIndex > 0 ? organizations[orgIndex - 1] : undefined;
  const next =
    orgIndex >= 0 && orgIndex < organizations.length - 1
      ? organizations[orgIndex + 1]
      : undefined;

  const { upcoming } = splitUpcomingAndPast(
    allUpcoming.filter((event) => event.organization?.slug === org.slug),
  );

  const hasApproximateColors = org.colors.some(
    (color) => color.source === "approximate",
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Link
        href="/organizations"
        className="text-sm font-medium text-brand underline"
      >
        &larr; All organizations
      </Link>

      {/* Org colors appear as a thin accent stripe only: several chapters'
          colors are approximate pending officer verification, so they never
          fill large surfaces. */}
      <div
        className="mt-6 h-2 rounded-full"
        style={{
          background: secondary
            ? `linear-gradient(90deg, ${primary.hex} 50%, ${secondary.hex} 50%)`
            : primary.hex,
        }}
        aria-hidden="true"
      />

      <header className="mt-6">
        <p className="text-sm font-medium uppercase tracking-wide text-foreground/70">
          {org.chapterDesignation} Chapter at Indiana University Bloomington
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {org.name}
        </h1>
      </header>

      {org.description ? (
        <RichText
          value={org.description}
          className="mt-4 max-w-3xl text-foreground/80 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mt-2"
        />
      ) : null}

      {org.status === "inactive" ? (
        <div className="mt-6 rounded-lg border border-accent bg-accent/15 p-4">
          <p className="font-semibold text-foreground">
            This chapter is currently inactive.
          </p>
          {org.statusNote ? (
            <p className="mt-1 text-sm text-foreground/80">{org.statusNote}</p>
          ) : null}
        </div>
      ) : null}

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        {org.nationalFounded?.date || org.nationalFounded?.location ? (
          <div className="rounded-lg border border-black/10 bg-surface p-6">
            <h2 className="text-lg font-semibold text-surface-foreground">
              National founding
            </h2>
            <p className="mt-2 text-sm text-surface-foreground/80">
              Founded {org.nationalFounded.date}
              {org.nationalFounded.location
                ? ` at ${org.nationalFounded.location}`
                : ""}
              .
            </p>
          </div>
        ) : null}

        <div className="rounded-lg border border-black/10 bg-surface p-6">
          <h2 className="text-lg font-semibold text-surface-foreground">
            {org.chapterDesignation} Chapter at IU
          </h2>
          {org.iuChartered?.date ? (
            <p className="mt-2 text-sm text-surface-foreground/80">
              Chartered {org.iuChartered.date}.{" "}
              {org.iuChartered.note ?? ""}
            </p>
          ) : (
            <p className="mt-2 text-sm text-surface-foreground/80">
              The exact charter date isn&apos;t documented on this site yet
              &mdash; chapter officers can add it in the content studio.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-black/10 bg-surface p-6">
          <h2 className="text-lg font-semibold text-surface-foreground">
            Colors
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-surface-foreground/80">
            {org.colors.map((color) => (
              <li key={color.label} className="flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/15"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                {color.label}
              </li>
            ))}
          </ul>
          {hasApproximateColors ? (
            <p className="mt-3 text-xs text-surface-foreground/70">
              Shown colors are close equivalents pending confirmation against
              the organization&apos;s official brand guide.
            </p>
          ) : null}
        </div>

        {org.officialSiteUrl ? (
          <div className="rounded-lg border border-black/10 bg-surface p-6">
            <h2 className="text-lg font-semibold text-surface-foreground">
              Learn more
            </h2>
            <a
              href={org.officialSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-brand underline"
            >
              Official national website ↗
            </a>
          </div>
        ) : null}
      </section>

      {org.nationalFounded?.founders && org.nationalFounded.founders.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">
            National founders
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {org.nationalFounded.founders.join(" · ")}
          </p>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">
          Upcoming events
        </h2>
        {upcoming.length === 0 ? (
          <EmptyState
            message={`No upcoming ${org.chapterDesignation} Chapter events right now.`}
            actionHref="/events"
            actionLabel="See all council events"
          />
        ) : (
          <ul className="mt-4 space-y-4">
            {upcoming.map((event) => (
              <li key={event.slug}>
                <EventCard event={event} orgName={org.name} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav
        aria-label="Between chapters"
        className="mt-12 flex justify-between border-t border-black/10 pt-6 text-sm"
      >
        {prev ? (
          <Link
            href={`/organizations/${prev.slug}`}
            className="font-medium text-brand underline"
          >
            &larr; {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/organizations/${next.slug}`}
            className="text-right font-medium text-brand underline"
          >
            {next.name} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
