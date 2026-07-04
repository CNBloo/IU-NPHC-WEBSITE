import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Shared rich-text schema used everywhere editors write longer copy
 * (org descriptions, officer bios, FAQ answers, mission statement).
 * Deliberately whitelists a small set of block/mark types and never
 * registers a raw-HTML block — that's the whole safety mechanism: there's
 * no escape hatch for editors to inject arbitrary markup, so the frontend
 * never needs to sanitize anything at render time either.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      name: "block",
      title: "Block",
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
      ],
      lists: [
        { title: "Bulleted", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.required().uri({ scheme: ["http", "https", "mailto"] }),
              }),
            ],
          }),
        ],
      },
    }),
  ],
});
