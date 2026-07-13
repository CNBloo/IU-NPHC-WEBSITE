"use client";

// The `sanity` package (pulled in via sanity.config.ts) can't be resolved in
// a Server Component graph — its swr dependency has no react-server export —
// so the config import lives behind this client boundary, not in page.tsx.
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function Studio() {
  return <NextStudio config={config} />;
}
