<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";

const route = useRoute();
const slug = route.params.slug as string;

const { data: event } = await useAsyncData(`event-${slug}`, () =>
  queryCollection("events").path(`/events/${slug}`).first()
);

if (!event.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Event not found",
    fatal: true,
  });
}

const eventDateTime = computed(() =>
  getEventDateTime(event.value!.date, event.value!.time)
);

interface Image {
  path: string;
  name: string;
  category: string;
  date?: string;
  size: number;
  modified: string;
}

const offset = ref(0);

const {
  data: galleryData,
  status: galleryStatus,
  execute,
} = await useFetch("/api/gallery", {
  query: {
    category: "events",
    date: event.value?.date || "",
    offset,
  },
  lazy: true,
  immediate: false,
});

const images = useState<Image[]>(`event-gallery-${slug}`, () => []);

watch(galleryData, () => {
  images.value = [...images.value, ...(galleryData.value?.images || [])];
});

const scrollArea = useTemplateRef("scrollArea");
const scrollElement = computed(() => scrollArea.value?.$el);

onMounted(() => {
  execute();

  useInfiniteScroll(
    scrollElement,
    () => {
      offset.value += 20;
    },
    {
      distance: 200,
      canLoadMore: () => {
        return (
          (galleryData.value?.hasMore && galleryStatus.value === "success") ||
          false
        );
      },
      direction: "right",
    }
  );
});
</script>

<template>
  <UPage v-if="event">
    <!-- Cover Image -->
    <div
      v-if="event.coverImage"
      class="relative w-full h-96 bg-gray-200 dark:bg-gray-800"
    >
      <NuxtImg
        :src="event.coverImage"
        :alt="event.title"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Main Content -->
        <div class="lg:col-span-2">
          <!-- Header with Title and Info -->
          <div class="mb-8">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-4xl font-bold mb-2">{{ event.title }}</h1>
                <p
                  v-if="event.description"
                  class="text-lg text-gray-600 dark:text-gray-400"
                >
                  {{ event.description }}
                </p>
              </div>
              <div v-if="event.status !== 'cancelled'" class="text-right">
                <UBadge
                  v-if="eventDateTime.isUpcoming"
                  color="primary"
                  size="lg"
                  class="mb-2"
                >
                  Upcoming
                </UBadge>
                <UBadge
                  v-else-if="eventDateTime.isPast"
                  color="neutral"
                  size="lg"
                  class="mb-2"
                >
                  Past
                </UBadge>
              </div>
              <UBadge v-else color="error" size="lg" class="mb-2">
                Cancelled
              </UBadge>
            </div>
          </div>

          <!-- Event Details Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <!-- Date & Time -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-calendar-20-solid" />
                  <span class="font-semibold">When</span>
                </div>
              </template>
              <div class="space-y-2">
                <div v-if="eventDateTime.formattedDate" class="font-medium">
                  {{ eventDateTime.formattedDate }}
                </div>
                <div v-else class="text-amber-600 dark:text-amber-500">TBC</div>
                <div
                  v-if="eventDateTime.formattedTimeRange"
                  class="text-sm text-gray-600 dark:text-gray-400"
                >
                  {{ eventDateTime.formattedTimeRange }}
                </div>
              </div>
            </UCard>

            <!-- Location -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-map-pin-20-solid" />
                  <span class="font-semibold">Where</span>
                </div>
              </template>
              <div class="space-y-2">
                <div v-if="event.location?.name" class="font-medium">
                  {{ event.location.name }}
                </div>
                <div
                  v-if="event.location?.address"
                  class="text-sm text-gray-600 dark:text-gray-400"
                >
                  {{ event.location.address }}
                </div>
                <div
                  v-if="event.location?.what3words"
                  class="text-xs font-mono text-gray-500 dark:text-gray-500"
                >
                  ///{{ event.location.what3words }}
                </div>
                <div
                  v-if="!event.location?.name"
                  class="text-amber-600 dark:text-amber-500 text-sm"
                >
                  TBC
                </div>
              </div>
            </UCard>
          </div>

          <!-- Map Embed -->
          <div v-if="event.location?.map" class="mb-8">
            <UCard>
              <template #header>
                <span class="font-semibold">Location Map</span>
              </template>
              <iframe
                :src="event.location.map"
                class="w-full h-128 border-0"
                :allowfullscreen="false"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </UCard>
          </div>

          <!-- Content -->
          <div class="prose dark:prose-invert max-w-none mb-8">
            <ContentRenderer :value="event" />
          </div>

          <!-- Gallery -->
          <template v-if="galleryStatus === 'pending' && images.length === 0">
            <h2 class="text-2xl font-bold mb-4">Gallery</h2>
            <div
              class="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <div class="text-center">
                <UIcon
                  name="i-heroicons-photo"
                  class="size-12 text-gray-400 mb-2"
                />
                <p class="text-gray-500 dark:text-gray-400">
                  Loading gallery...
                </p>
              </div>
            </div>
          </template>

          <template
            v-else-if="images.length === 0 && galleryStatus === 'success'"
          >
            <h2 class="text-2xl font-bold mb-4">Gallery</h2>
            <div
              class="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <div class="text-center">
                <UIcon
                  name="i-heroicons-camera"
                  class="size-12 text-gray-400 mb-2"
                />
                <p class="text-gray-500 dark:text-gray-400">
                  {{
                    eventDateTime.isUpcoming
                      ? "Photos will be added after the event!"
                      : "No photos available yet."
                  }}
                </p>
              </div>
            </div>
          </template>

          <template v-else-if="images.length === 1">
            <h2 class="text-2xl font-bold mb-4">Gallery</h2>
            <div class="relative rounded-lg overflow-hidden">
              <NuxtImg
                :src="images[0]!.path"
                :alt="`${event.title} - Gallery image`"
                sizes="100vw md:800px"
                format="webp"
                :quality="80"
                class="w-full max-h-128 object-cover"
                placeholder
              />
            </div>
          </template>

          <template v-else-if="images.length > 1">
            <h2 class="text-2xl font-bold mb-4">Gallery</h2>
            <div class="relative">
              <UScrollArea
                ref="scrollArea"
                v-slot="{ item, index }"
                :items="images"
                orientation="horizontal"
                :virtualize="{
                  gap: 10,
                  lanes: 2,
                  estimateSize: 340,
                }"
                class="w-full h-128 p-4"
              >
                <NuxtImg
                  :src="item.path"
                  :alt="`${event.title} - Gallery image`"
                  sizes="100vh sm:50vh md:400px"
                  format="webp"
                  :quality="70"
                  :loading="index > 8 ? 'lazy' : 'eager'"
                  class="size-full object-cover"
                  placeholder
                />
              </UScrollArea>

              <UProgress
                v-if="galleryStatus === 'pending'"
                indeterminate
                size="xs"
                class="absolute top-0 inset-x-0 z-1"
                :ui="{ base: 'bg-default' }"
              />
            </div>
          </template>
        </div>

        <!-- Right Column: Sidebar -->
        <aside class="lg:col-span-1">
          <div
            class="sticky top-[calc(var(--ui-header-height)+1rem)] space-y-4"
          >
            <!-- Registration Card -->
            <UCard>
              <template #header>
                <span class="font-semibold">Registration</span>
              </template>

              <div
                v-if="
                  event.registrationLink &&
                  eventDateTime.isUpcoming &&
                  event.date &&
                  event.location?.name
                "
                class="space-y-3"
              >
                <UButton
                  :href="event.registrationLink"
                  target="_blank"
                  size="lg"
                  block
                >
                  <UIcon
                    name="i-heroicons-arrow-top-right-on-square-20-solid"
                  />
                  Register Now
                </UButton>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-if="event.status === 'cancelled'"
                  class="rounded-lg bg-error-50 dark:bg-error-950 p-3 text-sm"
                >
                  <p class="text-error-900 dark:text-error-100 font-medium">
                    This event has been cancelled.
                  </p>
                </div>
                <div
                  v-else-if="eventDateTime.isPast"
                  class="rounded-lg bg-info-50 dark:bg-info-950 p-3 text-sm"
                >
                  <p class="text-info-900 dark:text-info-100">
                    This event has already happened. Check back for photos and
                    updates!
                  </p>
                </div>
                <div
                  v-else
                  class="rounded-lg bg-warning-50 dark:bg-warning-950 p-3 text-sm"
                >
                  <p class="text-warning-900 dark:text-warning-100">
                    Registration is not available yet. Check back soon :)
                  </p>
                </div>
              </div>
            </UCard>

            <!-- Feedback Card -->
            <UCard v-if="event.feedbackLink">
              <template #header>
                <span class="font-semibold">Feedback</span>
              </template>
              <UButton
                :href="event.feedbackLink"
                target="_blank"
                size="lg"
                block
                color="neutral"
                variant="outline"
              >
                <UIcon name="i-heroicons-chat-bubble-left-right-20-solid" />
                Leave Feedback
              </UButton>
            </UCard>
          </div>
        </aside>
      </div>
    </UContainer>
  </UPage>
</template>
