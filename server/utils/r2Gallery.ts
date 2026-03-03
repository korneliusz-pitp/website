import { blob } from 'hub:blob'

export interface ImageFile {
  path: string
  name: string
  category: string
  date?: string
  size: number
  modified: string
}

export interface GalleryMetadata {
  categories: string[]
  categoryCounts: Record<string, number>
  dates: string[]
  dateCounts: Record<string, number>
  total: number
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
const DEFAULT_PREFIX = 'studio/'
const DEFAULT_CACHE_TTL_MS = 60_000

interface ImageListCache {
  images: ImageFile[]
  expiresAt: number
}

let imageListCache: ImageListCache | undefined

const normaliseKey = (key: string) => key.replace(/^\/+/, '')

const isImageKey = (key: string) => {
  const lastDot = key.lastIndexOf('.')
  if (lastDot === -1) return false
  const ext = key.slice(lastDot).toLowerCase()
  return IMAGE_EXTENSIONS.has(ext)
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
    if (segment && DATE_REGEX.test(segment)) {
      date = segment
      category = directorySegments[i - 1] || category
      break
    }
  }

  return { category, date }
}

const getGalleryCacheTtlMs = () => {
  const ttl = Number(process.env.GALLERY_CACHE_TTL_MS ?? DEFAULT_CACHE_TTL_MS)
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

const mapBlobItemToImage = (item: BlobItem, prefix: string): ImageFile | null => {
  const key = normaliseKey(item.pathname)
  if (!isImageKey(key)) return null

  const { category, date } = parseCategoryAndDate(key, prefix)
  const name = key.split('/').pop() || key

  const modifiedAt = item.uploadedAt instanceof Date
    ? item.uploadedAt.toISOString()
    : item.uploadedAt

  return {
    path: `/${key}`,
    name,
    category,
    date,
    size: item.size,
    modified: modifiedAt || new Date().toISOString(),
  }
}

export const buildGalleryMetadata = (images: ImageFile[]): GalleryMetadata => {
  const categories = new Set<string>()
  const dates = new Set<string>()

  const categoryCounts: Record<string, number> = {}
  const dateCounts: Record<string, number> = {}

  for (const image of images) {
    categories.add(image.category)
    categoryCounts[image.category] = (categoryCounts[image.category] || 0) + 1

    if (image.date) {
      dates.add(image.date)
      dateCounts[image.date] = (dateCounts[image.date] || 0) + 1
    }
  }

  return {
    categories: [...categories].sort(),
    categoryCounts,
    dates: [...dates].sort().reverse(),
    dateCounts,
    total: images.length,
  }
}

export const listGalleryImages = async (
  options?: { forceRefresh?: boolean },
): Promise<ImageFile[]> => {
  const prefix = DEFAULT_PREFIX
  const cacheTtlMs = getGalleryCacheTtlMs()
  const now = Date.now()

  if (!options?.forceRefresh && cacheTtlMs > 0 && imageListCache && imageListCache.expiresAt > now) {
    return imageListCache.images
  }

  const allBlobs: BlobItem[] = []
  let cursor: string | undefined

  do {
    const result = await blob.list({ prefix, cursor, limit: 1000 })
    allBlobs.push(
      ...result.blobs.map(item => ({
        pathname: item.pathname,
        size: item.size ?? 0,
        uploadedAt: item.uploadedAt,
      })),
    )
    cursor = result.hasMore ? result.cursor : undefined
  } while (cursor)

  const images = allBlobs
    .map(item => mapBlobItemToImage(item, prefix))
    .filter((image): image is ImageFile => Boolean(image))
    .sort((a, b) => a.path.localeCompare(b.path))

  if (cacheTtlMs > 0) {
    imageListCache = {
      images,
      expiresAt: now + cacheTtlMs,
    }
  }

  return images
}

export const clearGalleryImageCache = () => {
  imageListCache = undefined
}

interface BlobItem {
  pathname: string
  size: number
  uploadedAt: string | Date
}
