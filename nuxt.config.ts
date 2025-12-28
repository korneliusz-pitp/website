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
});
