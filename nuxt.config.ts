import { defineOrganization } from 'nuxt-schema-org/schema'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxtjs/seo', '@nuxt/content', 'nuxt-studio', '@nuxt/a11y', '@nuxthub/core'],

  $production: {
    image: {
      provider: 'cloudflare',
      cloudflare: {
        baseURL: 'https://cdn.pupsinthepark.uk/',
      },
    },
  },

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://pupsinthepark.uk',
    name: 'Pups in the Park',
    description: 'A UK kemonomimi and alternative community meet organisation bringing together pups, handlers, and friends for safe, inclusive events.',
    defaultLocale: 'en-GB',
  },

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
  },

  ui: {
    theme: {
      colors: [
        // Semantic Roles (Required)
        'primary',
        'secondary',
        'neutral',
        'error',
        'warning',
        'success',
        'info',
        'discord',

        // Brand Role Scales (TODO: Add these)
        // "helper-red",
        // "content-purple",
        // "creator-gold",
        // "medical-green",
        // "management-midnight",
        // "creative-red",
      ],
    },
  },

  compatibilityDate: '2025-07-15',

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        vars: {
          STUDIO_GOOGLE_MODERATORS:
            'matt@pupsinthepark.uk,rea@pupsinthepark.uk,beck@pupsinthepark.uk',
        },
        observability: {
          enabled: true,
        },
      },
    },
  },

  hub: {
    blob: {
      driver: 'cloudflare-r2',
      binding: 'BLOB',
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  robots: {
    groups: [
      {
        userAgent: '*',
        disallow: ['/api/', '/_nuxt/'],
      },
    ],
  },

  schemaOrg: {
    identity: defineOrganization({
      name: 'Pups in the Park',
      description: 'The largest UK kemonomimi and alternative community meet. Bringing together therians, furries, kemonomimis, and alterhumans for safe, inclusive events.',
      url: 'https://pupsinthepark.uk',
      logo: '/images/brand/logo.png',
      email: 'info@pupsinthepark.uk',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          'email': 'info@pupsinthepark.uk',
          'contactType': 'General Enquiries',
        },
        {
          '@type': 'ContactPoint',
          'email': 'events@pupsinthepark.uk',
          'contactType': 'Events Team',
        },
        {
          '@type': 'ContactPoint',
          'email': 'safeguarding@pupsinthepark.uk',
          'contactType': 'Safeguarding',
        },
        {
          '@type': 'ContactPoint',
          'email': 'volunteer@pupsinthepark.uk',
          'contactType': 'Volunteer Enquiries',
        },
      ],
      sameAs: [
        'https://www.instagram.com/pupsintheparkuk/',
        'https://www.tiktok.com/@pupsintheparkuk',
        'https://discord.gg/9Sz2msbSDq',
        'https://www.gofundme.com/f/pupsinthepark',
      ],
      knowsAbout: [
        'https://pupsinthepark.uk/policies/code-of-conduct',
        'https://pupsinthepark.uk/policies/privacy',
        'https://pupsinthepark.uk/policies/safeguarding-adults',
        'https://pupsinthepark.uk/policies/safeguarding-children',
        'https://pupsinthepark.uk/policies/safety',
        'https://pupsinthepark.uk/policies/media-photography',
        'https://pupsinthepark.uk/policies/equality-diversity-inclusion',
        'https://pupsinthepark.uk/policies/environmental-impact',
        'https://pupsinthepark.uk/policies/online-safety',
        'https://pupsinthepark.uk/policies/complaints-grievances',
      ],
    }),
  },

  studio: {
    repository: {
      provider: 'github',
      owner: 'pups-in-the-park',
      repo: 'website',
      branch: 'main',
    },
    media: {
      external: true,
    },
  },
})
