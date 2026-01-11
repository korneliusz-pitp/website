# Copilot Instructions - Pups in the Park Website

## Project Overview

This is a **Nuxt 4 + Nuxt UI v4 + Nuxt Content v3** website for Pups in the Park, a UK kemonomimi/alternative community meet organisation. The site is deployed to **Cloudflare Pages** with **D1 database** integration for content storage.

**Language & Runtime**: British English spelling throughout. Uses **Bun** as package manager and runtime.

## Architecture & Key Components

### Content Management Strategy

- **Nuxt Content v3** uses **D1 database** (not filesystem) for content storage in production
- Content is defined via **typed collections** in `content.config.ts` using Zod schemas
- Four main collections: `content` (pages), `header`, `footer`, `events`, `rules`
- Query content using `queryCollection('collectionName')` (NOT `queryContent()`)
- YAML files (`header.yml`, `footer.yml`, `events/rules.yml`) in `/content` are data-driven configs

### Component Architecture

- **Global layout components**: `AppHeader.vue`, `AppFooter.vue` fetch config from composables
- **Composables pattern**: `useHeaderConfig()` and `useFooterConfig()` load YAML data via `queryCollection()`
- **Page structure**: `app/pages/` uses Nuxt file-based routing
- Dynamic routes: `events/[slug].vue` queries events by path `/events/${slug}`

### Nuxt UI v4 Patterns

- Use `UPage`, `UContainer`, `UPageHeader`, `UPageBody`, `UPageGrid` for consistent layouts
- Color system uses **semantic roles**: `primary`, `secondary`, `neutral` (mapped in `app.config.ts`)
- Brand colors defined: `cannon` (primary), `beck` (secondary)
- Future brand scales planned: helper-red, content-purple, creator-gold, medical-green, etc. (see `nuxt.config.ts`)

### Content Schema Examples

```typescript
// Events have: date, time, location, status, coverImage, gallery, registrationLink, feedbackLink
// Status enum: "draft" | "published" | "cancelled"
// Query example:
const event = await queryCollection("events").path("/events/pitp-1").first();
```

## Developer Workflows

### Local Development

```bash
bun install        # Install deps (also runs nuxt prepare)
bun dev            # Start dev server on localhost:3000
```

### Cloudflare Deployment

- Preset: `cloudflare_module` configured in `nitro.cloudflare`
- D1 binding: `DB` (database_id: `ab3472a7-a1c9-40a6-a240-feb4f241c9e3`)
- Uses Nuxt Studio for content editing (configured in `nuxt.config.ts`)
- Environment var: `STUDIO_GOOGLE_MODERATORS` lists admin emails

### Build & Deploy

```bash
bun run build      # Build for Cloudflare Pages
bun run generate   # Static generation (if needed)
bun run preview    # Preview production build locally
```

## Project-Specific Conventions

### Content Editing

- **Nuxt Studio** integration allows CMS-like editing of content via GitHub
- Property decorators for Studio UI: `property(schema).editor({ input: 'icon' | 'media' })`
- Example: `coverImage: property(z.string().optional()).editor({ input: 'media' })`

### Date/Time Handling

- Events use ISO date (`z.iso.date()`) and time (`z.iso.time()`)
- Combine date + time for display: `${date}T${time}Z`
- Computed properties in `[slug].vue` handle formatting: `formattedDate`, `formattedTimeRange`
- Status checks: `isUpcoming`, `isPast` based on current date comparison

### Navigation & Links

- External links use `target: "_blank"` (see `header.yml` donate button)
- Navigation supports nested children (see Events dropdown in header)
- Icon system uses Lucide/Heroicons: `i-lucide-mail`, `i-heroicons-envelope`

### Error Handling

- Use `throw createError({ statusCode, statusMessage, fatal: true })` for 404s
- Global error page: `app/error.vue`
- Validate data existence before rendering (e.g., `v-if="event"` in templates)

## Critical Integration Points

### Nuxt Content + D1

- Content database binding: `content.database.type = "d1"`, `bindingName = "DB"`
- Production content served from D1, dev uses fallback
- Schema validation happens at build time via `content.config.ts`

### Nuxt UI v4 Theme

- Custom colors defined in `app.config.ts` map semantic names to brand colors
- Color mode toggle via `<UColorModeButton />` in header
- Responsive design: Desktop/mobile nav handled via `lg:` breakpoints and template slots

### TypeScript & Zod

- All schemas use Zod v4 for validation
- Export types from composables: `export type HeaderConfig = { ... }`
- Nuxt UI types imported: `import type { NavigationMenuItem, ButtonProps } from "@nuxt/ui"`

## Common Patterns

### Async Data Fetching

```vue
<script setup>
const { data: event } = await useAsyncData("unique-key", () =>
  queryCollection("events").path("/events/pitp-1").first()
);
</script>
```

### SEO Setup

```vue
useSeoMeta({ title: page.value?.title, description: page.value?.description })
```

### Conditional Rendering with Content

```vue
<template>
  <ContentRenderer v-if="home" :value="home" />
  <div v-else>Content not found</div>
</template>
```

## File Structure Highlights

- `/app` - Application code (pages, components, layouts, composables)
- `/content` - YAML configs and markdown content (stored in D1 in production)
  - `/content/events/rules.yml` - Event conduct rules configuration
- `/public` - Static assets (fonts, images organised by event date)
- Root configs: `nuxt.config.ts`, `content.config.ts`, `app.config.ts`
