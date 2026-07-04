import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { sanityClient } from "./client";

let builder: ReturnType<typeof createImageUrlBuilder> | undefined;

export function urlFor(source: Image) {
  builder ??= createImageUrlBuilder(sanityClient());
  return builder.image(source);
}
