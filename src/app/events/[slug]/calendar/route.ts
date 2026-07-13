import { EVENTS } from "@/data/events";
import { buildEventIcs } from "@/lib/ics";

/** "Add to calendar" download: serves a single-event .ics file. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  return new Response(buildEventIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
