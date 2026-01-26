// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxt/content', 'nuxt-studio', '@nuxt/a11y'],

  $production: {
    image: {
      provider: 'cloudflare',
      cloudflare: {
        baseURL: 'https://pupsinthepark.uk/', // TODO: Update this when needed lol
      },
    },
  },

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

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
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'website',
            database_id: 'ab3472a7-a1c9-40a6-a240-feb4f241c9e3',
          },
        ],
        observability: {
          enabled: true,
        },
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  studio: {
    repository: {
      provider: 'github',
      owner: 'pups-in-the-park',
      repo: 'website',
      branch: 'main',
    },
  },
})
