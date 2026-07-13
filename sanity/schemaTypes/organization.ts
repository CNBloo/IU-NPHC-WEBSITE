import { defineField, defineType } from "sanity";

export const organization = defineType({
  name: "organization",
  title: "Organization",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Organization name",
      type: "string",
      description: 'e.g. "Delta Sigma Theta Sorority, Inc."',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "chapterDesignation",
      title: "Chapter designation",
      type: "string",
      description: 'e.g. "Gamma Nu"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      description:
        "Sets the page URL (/organizations/<slug>). Avoid changing it after launch — old links and search results will break.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "statusNote",
      title: "Status note",
      type: "string",
      description: 'Only shown when status is "Inactive", e.g. return timeline.',
      hidden: ({ document }) => document?.status !== "inactive",
    }),
    defineField({
      name: "colors",
      title: "Colors",
      type: "array",
      of: [
        {
          type: "object",
          name: "color",
          fields: [
            defineField({ name: "label", type: "string", title: "Label" }),
            defineField({
              name: "hex",
              type: "string",
              title: "Hex code",
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^#([0-9a-fA-F]{6})$/, { name: "hex color" }),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "hex" },
          },
        },
      ],
      validation: (rule) => rule.min(1).max(2),
    }),
    defineField({
      name: "logo",
      title: "Logo or photo",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "nationalFounded",
      title: "National founding",
      type: "object",
      fields: [
        defineField({ name: "date", type: "string", title: "Date" }),
        defineField({ name: "location", type: "string", title: "Location" }),
        defineField({
          name: "founders",
          type: "array",
          title: "Founders",
          of: [{ type: "string" }],
        }),
      ],
    }),
    defineField({
      name: "iuChartered",
      title: "IU chapter chartering",
      type: "object",
      description: "Leave blank if the exact charter date isn't documented yet.",
      fields: [
        defineField({ name: "date", type: "string", title: "Date" }),
        defineField({ name: "note", type: "string", title: "Note" }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              title: "Platform",
              options: {
                list: [
                  "Instagram",
                  "X (Twitter)",
                  "Facebook",
                  "TikTok",
                  "LinkedIn",
                  "YouTube",
                  "Website",
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              title: "URL",
              validation: (rule) =>
                rule.required().uri({ scheme: ["https"] }),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "interestFormUrl",
      title: "Interest form URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "officialSiteUrl",
      title: "Official national website",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "chapterDesignation",
      media: "logo",
    },
  },
});
