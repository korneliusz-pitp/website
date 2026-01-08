import { defineContentConfig, defineCollection, property } from "@nuxt/content";
import { z } from "zod/v4";

const navigationMenuItemSchema = z.object({
  label: z.string(),
  to: z.url().optional(),
  icon: property(z.string().optional()).editor({ input: "icon" }),
  description: z.string().optional(),
  disabled: z.boolean().default(false).optional(),
  target: z.string().optional(),
  children: z
    .object({
      label: z.string(),
      to: z.url().optional(),
      icon: property(z.string().optional()).editor({ input: "icon" }),
      description: z.string().optional(),
      disabled: z.boolean().default(false).optional(),
      target: z.string().optional(),
    })
    .optional(),
});

const buttonSchema = z.object({
  label: z.string().optional(),
  to: z.url().optional(),
  target: z.string().optional(),
  color: z
    .enum([
      "primary",
      "secondary",
      "neutral",
      "error",
      "warning",
      "success",
      "info",
    ])
    .optional(),
  variant: z
    .enum(["link", "solid", "outline", "soft", "subtle", "ghost"])
    .optional(),
  icon: property(z.string().optional()).editor({ input: "icon" }),
  size: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
});

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: {
        include: "**/*.md",
        exclude: ["events/*.md", "policies/*.md"],
      },
    }),
    header: defineCollection({
      type: "data",
      source: "header.yml",
      schema: z.object({
        title: z.string().optional(),
        to: z.string().optional(),
        toggle: z
          .object({
            color: z
              .enum([
                "primary",
                "secondary",
                "neutral",
                "error",
                "warning",
                "success",
                "info",
              ])
              .optional(),
            variant: z
              .enum(["link", "solid", "outline", "soft", "subtle", "ghost"])
              .optional(),
          })
          .optional(),
        links: z.array(navigationMenuItemSchema).optional(),
        buttons: z.array(buttonSchema).optional(),
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
        socials: z.array(buttonSchema).optional(),
        quickLinks: z.array(navigationMenuItemSchema).optional(),
        contacts: z
          .array(
            z.object({
              label: z.string(),
              email: z.email(),
              icon: property(z.string().optional()).editor({ input: "icon" }),
            })
          )
          .optional(),
        footnote: z.string().optional(),
      }),
    }),
    event: defineCollection({
      type: "page",
      source: "events/index.yml",
      schema: z.object({
        cta: z
          .object({
            title: z.string().optional(),
            description: z.string().optional(),
            button: buttonSchema.optional(),
          })
          .optional(),
      }),
    }),
    events: defineCollection({
      type: "page",
      source: "events/*.md",
      schema: z.object({
        date: z.iso.date().optional(),
        time: z
          .object({
            start: z.iso.time().optional(),
            end: z.iso.time().optional(),
          })
          .optional(),
        location: z
          .object({
            name: z.string().optional(),
            address: z.string().optional(),
            map: z.url().optional(),
            what3words: z.string().optional(),
          })
          .optional(),
        status: z.enum(["draft", "published", "cancelled"]).default("draft"),
        coverImage: property(z.string().optional()).editor({ input: "media" }),
        registrationLink: z.url().optional(),
        feedbackLink: z.url().optional(),
      }),
    }),
    rules: defineCollection({
      type: "page",
      source: "events/rules.yml",
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        intro: z.string().optional(),
        permittedGear: z
          .object({
            title: z.string(),
            icon: property(z.string().optional()).editor({ input: "icon" }),
            itemIcon: property(z.string().optional()).editor({ input: "icon" }),
            items: z.array(z.string()),
          })
          .optional(),
        prohibitedItems: z
          .object({
            title: z.string(),
            icon: property(z.string().optional()).editor({ input: "icon" }),
            itemIcon: property(z.string().optional()).editor({ input: "icon" }),
            items: z.array(z.string()),
          })
          .optional(),
        keyRules: z
          .array(
            z.object({
              label: z.string(),
              icon: property(z.string().optional()).editor({ input: "icon" }),
              content: z.array(z.string()),
            })
          )
          .optional(),
        callToAction: z
          .object({
            title: z.string().optional(),
            description: z.string().optional(),
            button: buttonSchema.optional(),
          })
          .optional(),
        contactEmail: z.email().optional(),
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
  },
});
