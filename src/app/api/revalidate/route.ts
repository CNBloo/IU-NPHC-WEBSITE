import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Sanity webhook target: publishing a document POSTs here with a {_type}
 * projection, and the matching cache tag (set by every query in
 * src/lib/sanity/queries.ts) is invalidated — so editors see their change on
 * the live site in seconds without a redeploy.
 *
 * Auth is a shared secret sent as an `x-revalidate-secret` header configured
 * on the webhook in manage.sanity.io, compared in constant time. The secret
 * is read directly (not via getSanityEnv) so a missing read token elsewhere
 * can't take this endpoint down with it.
 */
const REVALIDATABLE_TYPES = new Set([
  "organization",
  "officer",
  "event",
  "faq",
  "siteSettings",
]);

// Hashing both sides to a fixed length lets timingSafeEqual run without
// leaking length information via its length-mismatch throw.
function secretsMatch(supplied: string, expected: string): boolean {
  const a = createHash("sha256").update(supplied).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { message: "Revalidation is not configured" },
      { status: 503 },
    );
  }

  const supplied = request.headers.get("x-revalidate-secret") ?? "";
  if (!supplied || !secretsMatch(supplied, expected)) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let type: unknown;
  try {
    const body: unknown = await request.json();
    type =
      typeof body === "object" && body !== null && "_type" in body
        ? (body as { _type: unknown })._type
        : undefined;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof type !== "string" || !REVALIDATABLE_TYPES.has(type)) {
    return NextResponse.json(
      { message: "Missing or unknown _type" },
      { status: 400 },
    );
  }

  // Next 16 requires a cache-life profile; "max" keeps pages cached
  // indefinitely until this endpoint explicitly expires them.
  revalidateTag(type, "max");
  return NextResponse.json({ revalidated: true, tag: type });
}
