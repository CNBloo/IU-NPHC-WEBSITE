import type { SchemaTypeDefinition } from "sanity";
import { blockContent } from "./blockContent";
import { organization } from "./organization";
import { officer } from "./officer";
import { event } from "./event";
import { faq } from "./faq";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  blockContent,
  organization,
  officer,
  event,
  faq,
  siteSettings,
];
