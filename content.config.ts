import { defineCollection, z } from "@nuxt/content";

const colorEnum = z.enum([
  "primary",
  "secondary",
  "neutral",
  "error",
  "warning",
  "success",
  "info",
]);
const variantEnum = z.enum([
  "solid",
  "outline",
  "subtle",
  "soft",
  "ghost",
  "link",
]);
const sizeEnum = z.enum(["xs", "sm", "md", "lg", "xl"]);

const link = () =>
  z.object({
    label: z.string(),
    to: z.string().optional(),
    icon: z.string().optional().editor({ input: "icon" }),
    description: z.string().optional(),
    disabled: z.boolean().optional(),
    target: z.enum(["_blank", "_self"]).optional(),
  });

const button = () =>
  link().extend({
    color: colorEnum.optional(),
    variant: variantEnum.optional(),
    size: sizeEnum.optional(),
  });

const navItem = () =>
  link().extend({
    children: z.array(link()).optional(),
  });

const cta = () =>
  z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    buttons: z.array(button()).optional(),
  });

const itemList = () =>
  z.object({
    title: z.string(),
    icon: z.string().optional().editor({ input: "icon" }),
    itemIcon: z.string().optional().editor({ input: "icon" }),
    items: z.array(z.string()),
  });

export const collections = {
  content: defineCollection({
    type: "page",
    source: { include: "**/*.md", exclude: ["events/*.md", "policies/*.md"] },
  }),

  header: defineCollection({
    type: "data",
    source: "header.yml",
    schema: z.object({
      title: z.string().optional(),
      to: z.string().optional(),
      toggle: z
        .object({
          color: colorEnum.optional(),
          variant: variantEnum.optional(),
        })
        .optional(),
      links: z.array(navItem()).optional(),
      buttons: z.array(button()).optional(),
    }),
  }),

  footer: defineCollection({
    type: "data",
    source: "footer.yml",
    schema: z.object({
      brand: z
        .object({
          title: z.string(),
          description: z.array(z.string()),
        })
        .optional(),
      socials: z.array(button()).optional(),
      quickLinks: z.array(link()).optional(),
      contacts: z
        .array(
          z.object({
            label: z.string(),
            email: z.string().email(),
            icon: z.string().optional().editor({ input: "icon" }),
          })
        )
        .optional(),
      footnote: z.string().optional(),
    }),
  }),

  event: defineCollection({
    type: "page",
    source: "events/index.yml",
    schema: z.object({ cta: cta().optional() }),
  }),

  event_gallery: defineCollection({
    type: "page",
    source: "events/gallery.yml",
  }),

  events: defineCollection({
    type: "page",
    source: "events/*.md",
    schema: z.object({
      date: z.string().date().optional(),
      time: z
        .object({
          start: z.string().time().optional(),
          end: z.string().time().optional(),
        })
        .optional(),
      location: z
        .object({
          name: z.string().optional(),
          address: z.string().optional(),
          map: z.string().url().optional(),
          what3words: z.string().optional(),
        })
        .optional(),
      status: z.enum(["draft", "published", "cancelled"]).default("draft"),
      coverImage: z.string().optional().editor({ input: "media" }),
      registrationLink: z.string().url().optional(),
      feedbackLink: z.string().url().optional(),
    }),
  }),

  rules: defineCollection({
    type: "page",
    source: "events/rules.yml",
    schema: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      intro: z.string().optional(),
      permittedGear: itemList().optional(),
      prohibitedItems: itemList().optional(),
      keyRules: z
        .array(
          z.object({
            label: z.string(),
            icon: z.string().optional().editor({ input: "icon" }),
            content: z.array(z.string()),
          })
        )
        .optional(),
      callToAction: cta().optional(),
      contactEmail: z.string().email().optional(),
    }),
  }),

  policy: defineCollection({
    type: "page",
    source: "policies/index.yml",
  }),

  policies: defineCollection({
    type: "page",
    source: "policies/*.md",
  }),

  team: defineCollection({
    type: "data",
    source: "about/team/*.yml",
    schema: z.object({
      name: z.string(),
      role: z.string(),
      bio: z.string().optional(),
      image: z.string().optional().editor({ input: "media" }),
      socials: z
        .array(
          z.object({
            icon: z.string().optional().editor({ input: "icon" }),
            url: z.string().url().optional(),
            label: z.string().optional(),
          })
        )
        .optional(),
    }),
  }),

  about: defineCollection({
    type: "page",
    source: "about/index.yml",
    schema: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      intro: z.string().optional(),
      mission: z
        .object({
          title: z.string(),
          content: z.string(),
        })
        .optional(),
      values: z
        .array(
          z.object({
            label: z.string(),
            description: z.string(),
            icon: z.string().optional().editor({ input: "icon" }),
          })
        )
        .optional(),
      callToAction: cta().optional(),
    }),
  }),

  get_involved: defineCollection({
    type: "page",
    source: "get-involved/index.yml",
    schema: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      intro: z.string().optional(),
      timeline: z
        .array(
          z.object({
            title: z.string(),
            description: z.string().optional(),
            icon: z.string().optional().editor({ input: "icon" }),
          })
        )
        .optional(),
      callToAction: cta().optional(),
    }),
  }),

  volunteer_roles: defineCollection({
    type: "data",
    source: "get-involved/roles/*.yml",
    schema: z.object({
      name: z.string(),
      description: z.string().optional(),
      icon: z.string().optional().editor({ input: "icon" }),
      available: z.boolean(),
      colorHex: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .optional(),
      apply: link().optional(),
      details: z
        .object({
          requirements: z.array(z.string()).optional(),
          duties: z.array(z.string()).optional(),
          contactEmail: z.string().email().optional(),
        })
        .optional(),
    }),
  }),
};
