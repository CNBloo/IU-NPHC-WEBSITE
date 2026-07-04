import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "reference",
      to: [{ type: "organization" }],
      description: "Leave blank for council-wide events.",
    }),
    defineField({
      name: "eventType",
      title: "Event type",
      type: "string",
      options: {
        list: [
          { title: "Intake", value: "intake" },
          { title: "Social", value: "social" },
          { title: "Service", value: "service" },
          { title: "Educational", value: "educational" },
          { title: "Philanthropy", value: "philanthropy" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startDateTime",
      title: "Start date & time",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDateTime",
      title: "End date & time",
      type: "datetime",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "flyer",
      title: "Flyer",
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
      name: "pastGallery",
      title: "Past event photo gallery",
      type: "array",
      of: [
        {
          type: "image",
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "interestLink",
      title: "RSVP / interest link",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  orderings: [
    {
      title: "Start date, newest first",
      name: "startDateDesc",
      by: [{ field: "startDateTime", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "startDateTime", media: "flyer" },
  },
});
