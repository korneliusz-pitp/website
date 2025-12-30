// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "nuxt-studio",
  ],

  devtools: { enabled: true },

  compatibilityDate: "2025-07-15",

  studio: {
    repository: {
      provider: "github",
      owner: "pups-in-the-park",
      repo: "website",
      branch: "main",
    },
  },

  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        vars: {
          STUDIO_GOOGLE_MODERATORS:
            "matt@pupsinthepark.uk,rea@pupsinthepark.uk,beck@pupsinthepark.uk",
        },
        d1_databases: [
          {
            binding: "DB",
            database_name: "website",
            database_id: "ab3472a7-a1c9-40a6-a240-feb4f241c9e3",
          },
        ],
      },
    },
  },

  content: {
    database: {
      type: "d1",
      bindingName: "DB",
    },
  },
});
