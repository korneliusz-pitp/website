import { defineContentConfig, defineCollection, property } from "@nuxt/content";
import { z } from "zod";

const navigationMenuItemSchema = z.object({
  label: z.string(),
  to: z.string().optional(),
  icon: property(z.string().optional()).editor({ input: "icon" }),
  description: z.string().optional(),
  disabled: z.boolean().default(false).optional(),
  target: z.string().optional(),
  children: z
    .object({
      label: z.string(),
      to: z.string().optional(),
      icon: property(z.string().optional()).editor({ input: "icon" }),
      description: z.string().optional(),
      disabled: z.boolean().default(false).optional(),
      target: z.string().optional(),
    })
    .optional(),
});

const buttonSchema = z.object({
  label: z.string().optional(),
  to: z.string().optional(),
  href: z.string().optional(),
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
      source: "**/*.md",
    }),
    header: defineCollection({
      type: "data",
      source: "header.yml",
      schema: z.object({
        title: z.string().optional(),
        to: z.string().optional(),
        toggle: z
          .object({
            color: z.string().optional(),
            variant: z.string().optional(),
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
              email: z.string().email(),
              icon: property(z.string().optional()).editor({ input: "icon" }),
            })
          )
          .optional(),
        footnote: z.string().optional(),
      }),
    }),
  },
});
