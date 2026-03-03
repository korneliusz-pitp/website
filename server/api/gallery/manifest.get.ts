import { buildGalleryMetadata, listGalleryImages } from '../../utils/r2Gallery'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=120, s-maxage=300, stale-while-revalidate=600')

  const images = await listGalleryImages()
  const metadata = buildGalleryMetadata(images)

  return {
    images,
    categories: metadata.categories,
    categoryCounts: metadata.categoryCounts,
    dates: metadata.dates,
    dateCounts: metadata.dateCounts,
    total: metadata.total,
    generated: new Date().toISOString(),
  }
})
