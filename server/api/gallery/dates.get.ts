export default defineEventHandler(async () => {
  const images = await listGalleryImages()
  const dates = [
    ...new Set(images.map(img => img.date).filter(Boolean)),
  ].sort().reverse()

  const counts = images.reduce<Record<string, number>>((acc, img) => {
    if (img.date) {
      acc[img.date] = (acc[img.date] || 0) + 1
    }
    return acc
  }, {})

  return dates.map(date => ({
    date,
    count: counts[date] || 0,
  }))
})
