import { buildGalleryMetadata, listGalleryImages } from '../../utils/r2Gallery'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=120, s-maxage=300, stale-while-revalidate=600')

  const images = await listGalleryImages()
  const { categories, categoryCounts } = buildGalleryMetadata(images)

  return categories.map(category => ({
    category,
    count: categoryCounts[category] || 0,
  }))
})
