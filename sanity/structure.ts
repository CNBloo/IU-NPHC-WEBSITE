import type { StructureResolver } from "sanity/structure";

/**
 * Pins "Site Settings" to a single editable document instead of a list —
 * there's only ever one, so officers shouldn't be able to create a second
 * one by accident. Everything else uses the default list view.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "siteSettings",
      ),
    ]);
