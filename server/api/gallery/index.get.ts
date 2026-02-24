import { z } from 'zod/v4'

const querySchema = z.object({
  category: z.string().optional(),
  date: z.coerce.date().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { category, date, limit, offset, search } = await getValidatedQuery(
    event,
    query => querySchema.parse(query),
  )

  let images = await listGalleryImages()

  if (category) {
    images = images.filter(img => img.category === category)
  }

  if (date) {
    const dateString = date.toISOString().split('T')[0]
    images = images.filter(img => img.date === dateString)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    images = images.filter(img =>
      img.name.toLowerCase().includes(searchLower),
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
