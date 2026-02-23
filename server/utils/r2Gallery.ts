import { createError } from 'h3'

export interface ImageFile {
  path: string
  name: string
  category: string
  date?: string
  size: number
  modified: string
}

interface R2ObjectInfo {
  key: string
  size: number
  uploaded?: Date | string
}

interface R2ListResult {
  objects: R2ObjectInfo[]
  truncated: boolean
  cursor?: string
}

interface R2Bucket {
  list: (options?: {
    prefix?: string
    cursor?: string
    limit?: number
  }) => Promise<R2ListResult>
}

const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.avif',
])
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const DEFAULT_PREFIX = 'images/'

const normaliseKey = (key: string) => key.replace(/^\/+/, '')

const isImageKey = (key: string) => {
  const lastDot = key.lastIndexOf('.')
  if (lastDot === -1) return false
  const ext = key.slice(lastDot).toLowerCase()
  return IMAGE_EXTENSIONS.has(ext)
}

const getPrefix = (event: { context: { cloudflare?: { env?: Record<string, unknown> } } }) => {
  const envPrefix = event.context.cloudflare?.env?.R2_GALLERY_PREFIX
  if (typeof envPrefix === 'string' && envPrefix.trim()) {
    return envPrefix.replace(/^\/+/, '')
  }
  return DEFAULT_PREFIX
}

const parseCategoryAndDate = (key: string, prefix: string) => {
  const normalised = normaliseKey(key)
  const withoutPrefix = normalised.startsWith(prefix)
    ? normalised.slice(prefix.length)
    : normalised
  const segments = withoutPrefix.split('/').filter(Boolean)
  const fileIndex = segments.length - 1
  const directorySegments = segments.slice(0, Math.max(fileIndex, 0))

  let date: string | undefined
  let category = directorySegments[directorySegments.length - 1] || 'uncategorized'

  for (let i = 0; i < directorySegments.length; i += 1) {
    const segment = directorySegments[i]
    if (DATE_REGEX.test(segment)) {
      date = segment
      category = directorySegments[i - 1] || category
      break
    }
  }

  return { category, date }
}

const toIsoString = (uploaded?: Date | string) => {
  if (!uploaded) return new Date().toISOString()
  if (uploaded instanceof Date) return uploaded.toISOString()
  const parsed = new Date(uploaded)
  if (Number.isNaN(parsed.valueOf())) return new Date().toISOString()
  return parsed.toISOString()
}

const getMediaBucket = (event: { context: { cloudflare?: { env?: Record<string, unknown> } } }) => {
  const bucket = event.context.cloudflare?.env?.MEDIA as R2Bucket | undefined
  if (!bucket) {
    throw createError({
      statusCode: 500,
      statusMessage: 'R2 bucket binding \'MEDIA\' is not configured.',
    })
  }
  return bucket
}

export const listGalleryImages = async (event: {
  context: { cloudflare?: { env?: Record<string, unknown> } }
}): Promise<ImageFile[]> => {
  const bucket = getMediaBucket(event)
  const prefix = getPrefix(event)

  const objects: R2ObjectInfo[] = []
  let cursor: string | undefined

  do {
    const result = await bucket.list({ prefix, cursor, limit: 1000 })
    objects.push(...result.objects)
    cursor = result.truncated ? result.cursor : undefined
  } while (cursor)

  const images = objects
    .map((object) => {
      const key = normaliseKey(object.key)
      if (!isImageKey(key)) return null

      const { category, date } = parseCategoryAndDate(key, prefix)
      const name = key.split('/').pop() || key

      return {
        path: `/${key}`,
        name,
        category,
        date,
        size: object.size,
        modified: toIsoString(object.uploaded),
      } satisfies ImageFile
    })
    .filter((image): image is ImageFile => Boolean(image))
    .sort((a, b) => a.path.localeCompare(b.path))

  return images
}
