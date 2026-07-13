import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

// The "unconfigured" placeholder keeps `next build` (which imports this via
// the /studio route) working before the Sanity project exists; the Studio
// itself will show a connection error until the real project ID is set in
// .env.local — see .env.example.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "unconfigured";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "default",
  title: "IU National Pan-Hellenic Council",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
