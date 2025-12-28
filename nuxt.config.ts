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
            database_id: "4edea48e-70c0-4c40-83b5-bacfedeb85b8",
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
