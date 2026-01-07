import manifest from "~~/public/manifest.json";

export default defineEventHandler(async () => {
  return manifest;
});
