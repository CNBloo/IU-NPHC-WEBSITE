import type { Metadata } from "next";
import { EVENTS, type EventType } from "@/data/events";
import { ORGANIZATIONS } from "@/data/organizations";

export const metadata: Metadata = {
  title: "Events | IU National Pan-Hellenic Council",
  description:
    "Upcoming and past events from the IU National Pan-Hellenic Council and its member organizations.",
};

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  intake: "Intake",
  social: "Social",
  service: "Service",
  educational: "Educational",
  philanthropy: "Philanthropy",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

// Pulled out of the component body: reading the current time is inherently
// impure, and React's purity rules flag that inside a component/hook. A
// plain helper function isn't subject to that rule.
function splitUpcomingAndPast(events: typeof EVENTS) {
  const now = Date.now();
  const upcoming = events
    .filter((e) => new Date(e.startDateTime).getTime() >= now)
    .sort((a, b) => a.startDateTime.localeCompare(b.startDateTime));
  const past = events
    .filter((e) => new Date(e.startDateTime).getTime() < now)
    .sort((a, b) => b.startDateTime.localeCompare(a.startDateTime));
  return { upcoming, past };
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string; type?: string }>;
}) {
  const { org, type } = await searchParams;

  const filtered = EVENTS.filter((event) => {
    if (org && org !== "all" && event.orgSlug !== org) return false;
    if (type && type !== "all" && event.eventType !== type) return false;
    return true;
  });

  const { upcoming, past } = splitUpcomingAndPast(filtered);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
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
          <p className="mt-4 text-foreground/70">
            No upcoming events match these filters.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {upcoming.map((event) => {
              const eventOrg = ORGANIZATIONS.find((o) => o.slug === event.orgSlug);
              return (
                <li
                  key={event.slug}
                  className="rounded-lg border border-black/10 bg-surface p-6 text-surface-foreground shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-brand">
                    <span>{EVENT_TYPE_LABELS[event.eventType]}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{eventOrg ? eventOrg.orgName : "Council-wide"}</span>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">{event.title}</h3>
                  <p className="mt-1 text-sm text-surface-foreground/70">
                    {formatDate(event.startDateTime)} &middot; {event.location}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">Past Events</h2>
        {past.length === 0 ? (
          <p className="mt-4 text-foreground/70">
            No past events match these filters.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {past.map((event) => {
              const eventOrg = ORGANIZATIONS.find((o) => o.slug === event.orgSlug);
              return (
                <li
                  key={event.slug}
                  className="rounded-lg border border-black/10 bg-surface p-6 text-surface-foreground/80 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-surface-foreground/50">
                    <span>{EVENT_TYPE_LABELS[event.eventType]}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{eventOrg ? eventOrg.orgName : "Council-wide"}</span>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-surface-foreground">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-surface-foreground/60">
                    {formatDate(event.startDateTime)} &middot; {event.location}
                  </p>
                  <p className="mt-2 text-sm italic text-surface-foreground/50">
                    Photo gallery coming soon.
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
