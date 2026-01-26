<template>
  <UContainer class="py-8 space-y-6">
    <UPageHeader
      :title="gallery?.title"
      :description="gallery?.description"
    />

    <div class="columns-1 sm:columns-2 lg:columns-3 gap-4">
      <NuxtImg
        v-for="(item, index) in images"
        :key="item.path"
        :src="item.path"
        :alt="item.name"
        sizes="100vw sm:50vw md:400px"
        format="webp"
        :quality="70"
        :loading="index > 8 ? 'lazy' : 'eager'"
        class="w-full h-auto object-cover mb-4 break-inside-avoid"
        placeholder
      />
    </div>

    <UProgress
      v-if="status === 'pending'"
      indeterminate
      size="xs"
      class="fixed top-0 inset-x-0 z-50"
      :ui="{ base: 'bg-default' }"
    />
  </UContainer>
</template>

<script lang="ts" setup>
import { useInfiniteScroll } from '@vueuse/core'

interface Image {
  path: string
  name: string
  category: string
  date?: string
  size: number
  modified: string
}

const offset = ref(0)

const { data, status, execute } = await useFetch('/api/gallery', {
  query: {
    category: 'events',
    offset,
  },
  lazy: true,
  immediate: false,
})

const images = useState<Image[]>('event-gallery-images', () => [])

watch(data, () => {
  images.value = [...images.value, ...(data.value?.images || [])]
})

execute()

onMounted(() => {
  useInfiniteScroll(
    document,
    () => {
      offset.value += 20
    },
    {
      distance: 500,
      canLoadMore: () => {
        return (data.value?.hasMore && status.value === 'success') || false
      },
    },
  )
})

const { data: gallery } = await useAsyncData(`event-gallery`, () => {
  return queryCollection('event_gallery').first()
})

useSeoMeta({
  title: gallery.value?.title,
  description: gallery.value?.description,
})
</script>

<style></style>
