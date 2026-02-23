export default defineEventHandler(async (event) => {
  const images = await listGalleryImages(event)
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
