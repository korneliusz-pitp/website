import { z } from 'zod/v4'
import { listGalleryImages } from '../../utils/r2Gallery'

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const querySchema = z.object({
  category: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1).optional(),
  ),
  date: z.preprocess(emptyStringToUndefined, z.iso.date().optional()),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  search: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1).optional(),
  ),
})

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300')

  const { category, date, limit, offset, search } = await getValidatedQuery(
    event,
    query => querySchema.parse(query),
  )

  let images = await listGalleryImages()

  if (category) {
    const normalizedCategory = category.toLowerCase()
    images = images.filter(img => img.category.toLowerCase() === normalizedCategory)
  }

  if (date) {
    images = images.filter(img => img.date === date)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    images = images.filter(img =>
      img.name.toLowerCase().includes(searchLower)
      || img.path.toLowerCase().includes(searchLower),
    )
  }

  const paginatedImages = images.slice(offset, offset + limit)

  return {
    images: paginatedImages,
    total: images.length,
    limit,
    offset,
    hasMore: offset + limit < images.length,
  }
})
