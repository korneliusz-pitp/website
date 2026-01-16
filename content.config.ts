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

const pageFeature = () =>
  z.object({
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional().editor({ input: "icon" }),
    orientation: z.enum(["horizontal", "vertical"]).default("horizontal").optional(),
    to: z.string().optional(),
    target: z.enum(["_blank", "_self"]).optional(),
  });

const pageSection = () =>
  z.object({
    headline: z.string().optional(),
    icon: z.string().optional().editor({ input: "icon" }),
    title: z.string(),
    description: z.string().optional(),
    content: z.string().optional(),
    reverse: z.boolean().optional(),
    image: z.string().optional().editor({ input: "media" }),
    imageAlt: z.string().optional(),
    features: z.array(pageFeature()).optional(),
    links: z.array(button()).optional(),
  });

const pageCard = () =>
  z.object({
    icon: z.string().optional().editor({ input: "icon" }),
    title: z.string(),
    description: z.string().optional(),
    to: z.string().optional(),
    target: z.enum(["_blank", "_self"]).optional(),
    orientation: z.enum(["horizontal", "vertical"]).default("vertical").optional(),
    highlight: z.boolean().optional(),
    highlightColor: colorEnum.optional(),
    spotlight: z.boolean().optional(),
  });

export const collections = {
  content: defineCollection({
    type: "page",
    source: { include: "**/*.md", exclude: ["events/*.md", "policies/*.md"] },
  }),

  homepage: defineCollection({
    type: "page",
    source: "index.yml",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      hero: z.object({
        headline: z.string().optional(),
        title: z.string(),
        description: z.string(),
        image: z.string().optional().editor({ input: "media" }),
        imageAlt: z.string().optional(),
        links: z.array(button()).optional(),
        orientation: z.enum(["horizontal", "vertical"]).default("vertical").optional(),
      }).optional(),
      sections: z.array(pageSection()).optional(),
      features: z.object({
        title: z.string(),
        description: z.string().optional(),
        items: z.array(pageCard()),
      }).optional(),
      stats: z.object({
        title: z.string().optional(),
        items: z.array(
          z.object({
            value: z.string(),
            label: z.string(),
            icon: z.string().optional().editor({ input: "icon" }),
          })
        ),
      }).optional(),
      callToAction: cta().optional(),
    }),
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
      ageGroups: z
        .object({
          title: z.string(),
          groups: z.array(
            z.object({
              ageRange: z.string(),
              summary: z.string(),
            })
          ),
        })
        .optional(),
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

  contact: defineCollection({
    type: "page",
    source: "contact.yml",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      intro: z.string().optional(),
      contactMethods: z.array(
        z.object({
          department: z.string(),
          email: z.string().email(),
          icon: z.string().optional().editor({ input: "icon" }),
          description: z.string().optional(),
          priority: z.enum(["normal", "high"]).default("normal").optional(),
        })
      ),
      socialConnections: z
        .object({
          title: z.string(),
          description: z.string().optional(),
          links: z.array(button()),
        })
        .optional(),
      faq: z
        .object({
          title: z.string(),
          items: z.array(
            z.object({
              question: z.string(),
              answer: z.string(),
              link: z.string().optional(),
            })
          ),
        })
        .optional(),
    }),
  }),

  report: defineCollection({
    type: "page",
    source: "report.yml",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      urgency: z.object({
        title: z.string(),
        emergency: z.object({
          description: z.string(),
          actions: z.array(button()),
        }),
        nonEmergency: z.object({
          description: z.string(),
        }),
      }),
      formInfo: z.object({
        title: z.string(),
        intro: z.string(),
        googleFormUrl: z.string().url(),
        googleFormHeight: z.number().default(1200),
        submissionNote: z.string().optional(),
      }),
      whatToReport: z.object({
        title: z.string(),
        categories: z.array(
          z.object({
            label: z.string(),
            icon: z.string().optional().editor({ input: "icon" }),
            description: z.string(),
            examples: z.array(z.string()),
          })
        ),
      }),
      supportResources: z
        .object({
          title: z.string(),
          description: z.string().optional(),
          resources: z.array(
            z.object({
              label: z.string(),
              contact: z.string(),
              description: z.string().optional(),
              icon: z.string().optional().editor({ input: "icon" }),
            })
          ),
        })
        .optional(),
      relatedPolicies: z
        .object({
          title: z.string(),
          links: z.array(link()),
        })
        .optional(),
    }),
  }),

  sustainability: defineCollection({
    type: "page",
    source: "sustainability.yml",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      leafImage: z.string().optional().editor({ input: "media" }),
      hero: z
        .object({
          image: z.string().optional().editor({ input: "media" }),
          alt: z.string().optional(),
        })
        .optional(),
      sections: z.array(pageSection()),
      initiatives: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string().optional().editor({ input: "icon" }),
            stats: z
              .object({
                value: z.string(),
                label: z.string(),
              })
              .optional(),
          })
        )
        .optional(),
      callToAction: cta().optional(),
    }),
  }),
};
