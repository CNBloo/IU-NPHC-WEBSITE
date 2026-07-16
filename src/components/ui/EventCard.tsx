import type { EventDoc } from "@/lib/sanity/types";
import { formatEventDateTime } from "@/lib/dates";

export const EVENT_TYPE_LABELS: Record<EventDoc["eventType"], string> = {
  intake: "Intake",
  social: "Social",
  service: "Service",
  educational: "Educational",
  philanthropy: "Philanthropy",
};

type EventCardProps = {
  event: EventDoc;
  /** Display name of the hosting org; null renders as council-wide. */
  orgName: string | null;
  /** Past events render dimmed, without a calendar link. */
  past?: boolean;
};

/** The single event renderer — used by the events page and the home teaser. */
export function EventCard({ event, orgName, past = false }: EventCardProps) {
  return (
    <article
      className={`rounded-lg border border-black/10 bg-surface p-6 shadow-sm ${
        past ? "text-surface-foreground/80" : "text-surface-foreground"
      }`}
    >
      <div
        className={`flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide ${
          past ? "text-surface-foreground/60" : "text-brand"
        }`}
      >
        <span>{EVENT_TYPE_LABELS[event.eventType]}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{orgName ?? "Council-wide"}</span>
      </div>
      <h3 className="mt-1 text-lg font-semibold text-surface-foreground">
        {event.title}
      </h3>
      <p className="mt-1 text-sm text-surface-foreground/70">
        {formatEventDateTime(event.startDateTime)}
        {event.location ? <> &middot; {event.location}</> : null}
      </p>
      {past ? (
        <p className="mt-2 text-sm italic text-surface-foreground/60">
          Photo gallery coming soon.
        </p>
      ) : (
        <a
          href={`/events/${event.slug}/calendar`}
          className="mt-3 inline-block text-sm font-medium text-brand underline"
        >
          Add to calendar
          <span className="sr-only"> — {event.title}</span>
        </a>
      )}
    </article>
  );
}
