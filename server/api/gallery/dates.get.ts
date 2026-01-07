import manifest from "~~/public/manifest.json";

export default defineEventHandler(async () => {
  const dates = manifest.dates;

  const counts = manifest.images.reduce<Record<string, number>>((acc, img) => {
    if (img.date) {
      acc[img.date] = (acc[img.date] || 0) + 1;
    }
    return acc;
  }, {});

  return dates.map((date) => ({
    date,
    count: counts[date] || 0,
  }));
});
