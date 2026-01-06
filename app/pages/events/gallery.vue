<template>
  <UContainer class="py-8 space-y-6">
    <UAlert color="warning" title="Under Construction" description="The events gallery is currently under construction. We are working hard to bring you this feature soon." icon="i-lucide-alert-triangle" />

    <UScrollArea
    v-slot="{ item, index }"
    :items="items"
    :virtualize="{
      gap: 16,
      lanes: 3,
      estimateSize: 480
    }"
    class="w-full h-128 p-4"
    >
      <img
      :src="item.src"
      :alt="item.title"
      :width="item.width"
      :height="item.height"
      :loading="index > 8 ? 'lazy' : 'eager'"
      class="rounded-md size-full object-cover"
    >
    </UScrollArea>

  </UContainer>
</template>

<script lang="ts" setup>
const heights = [320, 480, 640, 800]

// Pseudo-random height selection with longer cycle to avoid alignment patterns
function getHeight(index: number) {
  const seed = (index * 11 + 7) % 17
  return heights[seed % heights.length]!
}

const items = Array.from({ length: 1000 }).map((_, index) => {
  const height = getHeight(index)

  return {
    id: index,
    title: `Item ${index + 1}`,
    src: `https://picsum.photos/640/${height}?v=${index}`,
    width: 640,
    height
  }
})
</script>

<style>

</style>