import { defineField, defineType } from "sanity";

export const officer = defineType({
  name: "officer",
  title: "Executive Board Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      description: 'e.g. "Council President"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "organization",
      title: "Represents organization",
      type: "reference",
      to: [{ type: "organization" }],
      description: "Optional — leave blank for council-wide officers.",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      description:
        "Optional — leave blank until the officer has given written consent to publish their photo.",
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
      name: "bio",
      title: "Bio",
      type: "blockContent",
    }),
    defineField({
      name: "approvedForPublication",
      title: "Approved to publish contact info?",
      type: "boolean",
      description:
        "Must be checked for email/phone below to ever appear on the public site.",
      initialValue: false,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      hidden: ({ document }) => !document?.approvedForPublication,
      validation: (rule) =>
        rule.email().warning("Should be a valid email address"),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      hidden: ({ document }) => !document?.approvedForPublication,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "position", media: "photo" },
  },
});
