<template>
  <UContainer class="py-8 space-y-6">
    <UAlert
      color="warning"
      title="Under Construction"
      description="The events gallery is currently under construction. We are working hard to bring you this feature soon."
      icon="i-lucide-alert-triangle"
    />

    <UScrollArea
      ref="scrollArea"
      v-slot="{ item, index }"
      :items="images"
      :virtualize="{
        gap: 16,
        lanes: 3,
        estimateSize: 480,
      }"
      class="w-full h-128 p-4"
    >
      <NuxtImg
        :src="item.path"
        :alt="item.name"
        sizes="100vw sm:50vw md:400px"
        format="webp"
        :quality="70"
        :loading="index > 8 ? 'lazy' : 'eager'"
        class="rounded-md size-full object-cover"
        placeholder
      />
    </UScrollArea>

    <UProgress
      v-if="status === 'pending'"
      indeterminate
      size="xs"
      class="absolute top-0 inset-x-0 z-1"
      :ui="{ base: 'bg-default' }"
    />
  </UContainer>
</template>

<script lang="ts" setup>
import { useInfiniteScroll } from "@vueuse/core";

interface Image {
  path: string;
  name: string;
  category: string;
  date?: string;
  size: number;
  modified: string;
}

const offset = ref(0);

const { data, status, execute } = await useFetch("/api/gallery", {
  query: {
    category: "events",
  },
  key: "scroll-area-images-infinite-scroll",
  params: { offset },
  lazy: true,
  immediate: false,
});

const images = ref<Image[]>([]);

watch(data, () => {
  images.value = [...images.value, ...(data.value?.images || [])];
});

execute();

const scrollArea = useTemplateRef("scrollArea");

onMounted(() =>
  useInfiniteScroll(
    scrollArea.value?.$el,
    () => {
      offset.value += 10;
    },
    {
      distance: 200,
      canLoadMore: () => {
        return data.value?.hasMore || false;
      },
    }
  )
);
</script>

<style></style>
