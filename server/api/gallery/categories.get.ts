import manifest from "~~/public/manifest.json";

export default defineEventHandler(async () => {
  const categories = manifest.categories;

  const counts = manifest.images.reduce<Record<string, number>>((acc, img) => {
    acc[img.category] = (acc[img.category] || 0) + 1;
    return acc;
  }, {});

  return categories.map((category) => ({
    category,
    count: counts[category] || 0,
  }));
});
