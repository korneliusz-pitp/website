import { buildGalleryMetadata, listGalleryImages } from '../../utils/r2Gallery'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=120, s-maxage=300, stale-while-revalidate=600')

  const images = await listGalleryImages()
  const { dates, dateCounts } = buildGalleryMetadata(images)

  return dates.map(date => ({
    date,
    count: dateCounts[date] || 0,
  }))
})
