import type { Metadata } from "next";
import { headers } from "next/headers";
import { EVENTS } from "@/data/events";
import { ORGANIZATIONS } from "@/data/organizations";
import { splitUpcomingAndPast } from "@/lib/dates";
import { EventCard, EVENT_TYPE_LABELS } from "@/components/ui/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Events | IU National Pan-Hellenic Council",
  description:
    "Upcoming and past events from the IU National Pan-Hellenic Council and its member organizations.",
};

const orgName = (slug: string | null) =>
  ORGANIZATIONS.find((o) => o.slug === slug)?.orgName ?? null;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string; type?: string }>;
}) {
  const { org, type } = await searchParams;
  const filtersActive = Boolean(
    (org && org !== "all") || (type && type !== "all"),
  );

  const filtered = EVENTS.filter((event) => {
    if (org && org !== "all" && event.orgSlug !== org) return false;
    if (type && type !== "all" && event.eventType !== type) return false;
    return true;
  });

  const { upcoming, past } = splitUpcomingAndPast(filtered);

  // Event structured data for search engines — upcoming events only. The
  // strict CSP applies to every script tag, so this one carries the
  // per-request nonce issued in src/proxy.ts.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const eventJsonLd = JSON.stringify(
    upcoming.map((event) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      startDate: event.startDateTime,
      location: { "@type": "Place", name: event.location },
      organizer: {
        "@type": "Organization",
        name: orgName(event.orgSlug) ?? "IU National Pan-Hellenic Council",
      },
    })),
  ).replace(/</g, "\\u003c");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {upcoming.length > 0 && (
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: eventJsonLd }}
        />
      )}
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Events
      </h1>
      <p className="mt-4 max-w-3xl text-foreground/80">
        Filter by organization or event type — the filters update the URL, so
        you can share a link straight to a filtered view.
      </p>

      <form
        method="get"
        className="mt-8 flex flex-wrap items-end gap-4 rounded-lg border border-black/10 bg-surface p-4"
      >
        <div>
          <label
            htmlFor="org"
            className="block text-sm font-medium text-surface-foreground"
          >
            Organization
          </label>
          <select
            id="org"
            name="org"
            defaultValue={org ?? "all"}
            className="mt-1 rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-surface-foreground"
          >
            <option value="all">All organizations</option>
            {ORGANIZATIONS.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.chapterDesignation} — {o.orgName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-surface-foreground"
          >
            Event type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={type ?? "all"}
            className="mt-1 rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-surface-foreground"
          >
            <option value="all">All types</option>
            {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="rounded-md bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground"
        >
          Apply filters
        </button>
        <a
          href="/events"
          className="text-sm font-medium text-brand underline"
        >
          Clear filters
        </a>
      </form>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">Upcoming</h2>
        {upcoming.length === 0 ? (
          <EmptyState
            message={
              filtersActive
                ? "No upcoming events match these filters."
                : "No upcoming events right now — check back soon."
            }
            actionHref={filtersActive ? "/events" : undefined}
            actionLabel={filtersActive ? "Clear filters" : undefined}
          />
        ) : (
          <ul className="mt-4 space-y-4">
            {upcoming.map((event) => (
              <li key={event.slug}>
                <EventCard event={event} orgName={orgName(event.orgSlug)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">Past Events</h2>
        {past.length === 0 ? (
          <EmptyState
            message={
              filtersActive
                ? "No past events match these filters."
                : "No past events yet."
            }
            actionHref={filtersActive ? "/events" : undefined}
            actionLabel={filtersActive ? "Clear filters" : undefined}
          />
        ) : (
          <ul className="mt-4 space-y-4">
            {past.map((event) => (
              <li key={event.slug}>
                <EventCard
                  event={event}
                  orgName={orgName(event.orgSlug)}
                  past
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
