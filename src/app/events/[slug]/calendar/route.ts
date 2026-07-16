import { getEventBySlug } from "@/lib/sanity/queries";
import { toPlainText } from "@/lib/sanity/plainText";
import { buildEventIcs } from "@/lib/ics";

/** "Add to calendar" download: serves a single-event .ics file. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  return new Response(
    buildEventIcs({
      slug: event.slug,
      title: event.title,
      startDateTime: event.startDateTime,
      location: event.location,
      description: toPlainText(event.description),
    }),
    {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
      },
    },
  );
}
