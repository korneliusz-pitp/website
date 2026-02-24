import { blob } from 'hub:blob'

export interface ImageFile {
  path: string
  name: string
  category: string
  date?: string
  size: number
  modified: string
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

export const listGalleryImages = async (): Promise<ImageFile[]> => {
  const prefix = DEFAULT_PREFIX

  interface BlobItem {
    pathname: string
    size: number
    uploadedAt: string
  }

  const allBlobs: BlobItem[] = []
  let cursor: string | undefined

  do {
    const result = await blob.list({ prefix, cursor, limit: 1000 })
    allBlobs.push(...result.blobs as BlobItem[])
    cursor = result.hasMore ? result.cursor : undefined
  } while (cursor)

  const images = allBlobs
    .map((item) => {
      const key = normaliseKey(item.pathname)
      if (!isImageKey(key)) return null

      const { category, date } = parseCategoryAndDate(key, prefix)
      const name = key.split('/').pop() || key

      return {
        path: `/${key}`,
        name,
        category,
        date,
        size: item.size,
        modified: item.uploadedAt || new Date().toISOString(),
      } satisfies ImageFile
    })
    .filter((image): image is ImageFile => Boolean(image))
    .sort((a, b) => a.path.localeCompare(b.path))

  return images
}
