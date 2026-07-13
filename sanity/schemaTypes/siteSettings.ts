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
      description: "Short line shown under the site name on the home page.",
    }),
    defineField({
      name: "missionStatement",
      title: "Mission statement",
      type: "blockContent",
      description: "Shown in the mission section of the home page.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      description:
        "Large photo at the top of the home page. Only upload photos the council has permission to use.",
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
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
