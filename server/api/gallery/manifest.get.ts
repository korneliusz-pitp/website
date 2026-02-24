export default defineEventHandler(async () => {
  const images = await listGalleryImages()
  const categories = [...new Set(images.map(img => img.category))].sort()
  const dates = [
    ...new Set(images.map(img => img.date).filter(Boolean)),
  ].sort().reverse()

  return {
    images,
    categories,
    dates,
    generated: new Date().toISOString(),
  }
})
