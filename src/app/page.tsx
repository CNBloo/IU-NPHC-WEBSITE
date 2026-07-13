import { ButtonLink } from "@/components/ui/Button";
import { EventCard } from "@/components/ui/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { EVENTS } from "@/data/events";
import { ORGANIZATIONS } from "@/data/organizations";
import { splitUpcomingAndPast } from "@/lib/dates";

// The upcoming split depends on the current time, so a purely static home
// page would freeze it at build time; hourly revalidation keeps it honest
// without giving up static serving.
export const revalidate = 3600;

export default function Home() {
  const { upcoming } = splitUpcomingAndPast(EVENTS);
  const nextThree = upcoming.slice(0, 3);

  return (
    <div className="flex flex-col">
      <HeroCarousel className="h-[70vh] min-h-[560px]">
        <div className="flex flex-col items-center gap-6 px-4">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            IU National Pan-Hellenic Council
          </h1>
          <p className="max-w-xl text-lg text-white/90">
            Uniting the Divine Nine chapters at Indiana University
            Bloomington through scholarship, service, and
            sisterhood/brotherhood.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/organizations" variant="secondary">
              Meet Our Organizations
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Contact Us
            </ButtonLink>
          </div>
        </div>
      </HeroCarousel>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold">Our Mission</h2>
        <p className="mt-4 max-w-3xl text-surface-foreground/80">
          The IU National Pan-Hellenic Council exists to promote unity and
          cooperative action among its member organizations, uphold the
          values of scholarship and community service on which each chapter
          was founded, and serve as a resource for students interested in the
          Divine Nine at Indiana University Bloomington.
        </p>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold text-surface-foreground">
            Upcoming Events
          </h2>
          {nextThree.length === 0 ? (
            <EmptyState
              message="No upcoming events right now — check back soon."
              actionHref="/events"
              actionLabel="See past events"
            />
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nextThree.map((event) => (
                <EventCard
                  key={event.slug}
                  event={event}
                  orgName={
                    ORGANIZATIONS.find((o) => o.slug === event.orgSlug)
                      ?.orgName ?? null
                  }
                />
              ))}
            </div>
          )}
          <div className="mt-8">
            <ButtonLink href="/events">See All Events</ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
