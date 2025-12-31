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
  color: z.string().optional(),
  variant: z.string().optional(),
  icon: property(z.string().optional()).editor({ input: "icon" }),
  size: z.string().optional(),
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
  },
});
