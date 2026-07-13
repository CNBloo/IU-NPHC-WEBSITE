import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));

import { revalidateTag } from "next/cache";
import { POST } from "./route";

const SECRET = "test-webhook-secret";

function makeRequest({
  secret,
  body,
}: {
  secret?: string;
  body?: unknown;
}): Request {
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret !== undefined ? { "x-revalidate-secret": secret } : {}),
    },
    body: typeof body === "string" ? body : JSON.stringify(body ?? {}),
  });
}

beforeEach(() => {
  process.env.SANITY_REVALIDATE_SECRET = SECRET;
  vi.mocked(revalidateTag).mockClear();
});

afterEach(() => {
  delete process.env.SANITY_REVALIDATE_SECRET;
});

describe("POST /api/revalidate", () => {
  it("revalidates the tag for a known document type with the right secret", async () => {
    const res = await POST(makeRequest({ secret: SECRET, body: { _type: "faq" } }));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("faq", "max");
  });

  it("returns 401 for a wrong secret", async () => {
    const res = await POST(
      makeRequest({ secret: "wrong", body: { _type: "faq" } }),
    );
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 401 when the secret header is missing", async () => {
    const res = await POST(makeRequest({ body: { _type: "faq" } }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for an unknown document type", async () => {
    const res = await POST(
      makeRequest({ secret: SECRET, body: { _type: "user" } }),
    );
    expect(res.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 400 for a body with no _type", async () => {
    const res = await POST(makeRequest({ secret: SECRET, body: {} }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await POST(makeRequest({ secret: SECRET, body: "{not json" }));
    expect(res.status).toBe(400);
  });

  it("returns 503 when the endpoint is unconfigured", async () => {
    delete process.env.SANITY_REVALIDATE_SECRET;
    const res = await POST(
      makeRequest({ secret: SECRET, body: { _type: "faq" } }),
    );
    expect(res.status).toBe(503);
  });
});
