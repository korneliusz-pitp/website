export default defineEventHandler(async () => {
  const images = await listGalleryImages()
  const categories = [...new Set(images.map(img => img.category))].sort()

  const counts = images.reduce<Record<string, number>>((acc, img) => {
    acc[img.category] = (acc[img.category] || 0) + 1
    return acc
  }, {})

  return categories.map(category => ({
    category,
    count: counts[category] || 0,
  }))
})
