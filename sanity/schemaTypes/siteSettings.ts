import { defineField, defineType } from "sanity";

/**
 * Singleton document — see sanity/structure.ts for how the Studio pins
 * this to a single editable entry instead of a list.
 *
 * Deliberately has no "contact recipient email" field: that address is a
 * server-side secret (CONTACT_RECIPIENT_EMAIL env var), not CMS content,
 * because Sanity's dataset is readable through the CDN API even with a
 * viewer-scoped token — see README for the full reasoning.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      initialValue: "IU National Pan-Hellenic Council",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "missionStatement",
      title: "Mission statement",
      type: "blockContent",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
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
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [
            defineField({ name: "platform", type: "string", title: "Platform" }),
            defineField({
              name: "url",
              type: "url",
              title: "URL",
              validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
