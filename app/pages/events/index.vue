<script setup lang="ts">
const { data: page } = await useAsyncData('events-page', () =>
  queryCollection('event').first(),
)

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})

const { data: events } = await useAsyncData('events', () =>
  queryCollection('events').where('status', '=', 'published').all(),
)

const upcomingEvents = computed(() => {
  if (!events.value) return []
  return events.value
    .filter(event => getEventDateTime(event.date, event.time).isUpcoming)
    .sort((a, b) => {
      const dateTimeA = getEventDateTime(a.date, a.time)
      const dateTimeB = getEventDateTime(b.date, b.time)
      const timeA = dateTimeA.startDateTime?.getTime() ?? Number.POSITIVE_INFINITY
      const timeB = dateTimeB.startDateTime?.getTime() ?? Number.POSITIVE_INFINITY
      return timeA - timeB
    })
})

const pastEvents = computed(() => {
  if (!events.value) return []
  return events.value
    .filter(event => getEventDateTime(event.date, event.time).isPast)
    .sort((a, b) => {
      const dateTimeA = getEventDateTime(a.date, a.time)
      const dateTimeB = getEventDateTime(b.date, b.time)
      const timeA = dateTimeA.startDateTime?.getTime() ?? Number.NEGATIVE_INFINITY
      const timeB = dateTimeB.startDateTime?.getTime() ?? Number.NEGATIVE_INFINITY
      return timeB - timeA
    })
})
</script>

<template>
  <UPage>
    <UContainer v-if="page">
      <!-- Page Header -->
      <UPageHero
        :title="page.title"
        :description="page.description"
      />

      <UPageBody>
        <!-- Upcoming Events Section -->
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-4">
              Upcoming Events
            </h2>
            <div v-if="upcomingEvents.length > 0">
              <div
                :class="[
                  'grid gap-6',
                  upcomingEvents.length === 1 ? 'max-w-full' : 'lg:grid-cols-2',
                ]"
              >
                <EventCard
                  v-for="event in upcomingEvents"
                  :key="event.path"
                  :title="event.title"
                  :description="event.description"
                  :date="event.date"
                  :time="event.time"
                  :location="event.location"
                  :cover-image="event.coverImage"
                  :status="event.status"
                  :to="event.path"
                  :orientation="
                    upcomingEvents.length === 1 ? 'horizontal' : 'vertical'
                  "
                />
              </div>
            </div>
            <div
              v-else
              class="rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center"
            >
              <UIcon
                name="i-lucide-calendar-off"
                class="w-12 h-12 mx-auto text-neutral-400 mb-3"
              />
              <p class="text-neutral-600 dark:text-neutral-400">
                No upcoming events scheduled yet.
              </p>
            </div>
          </div>

          <!-- Past Events Section -->
          <div v-if="pastEvents.length > 0">
            <h2 class="text-2xl font-bold mb-4">
              Past Events
            </h2>
            <div class="grid gap-6 lg:grid-cols-2">
              <EventCard
                v-for="event in pastEvents"
                :key="event.path"
                :title="event.title"
                :description="event.description"
                :date="event.date"
                :time="event.time"
                :location="event.location"
                :cover-image="event.coverImage"
                :status="event.status"
                :to="event.path"
                orientation="vertical"
              />
            </div>
          </div>
          <UCard class="bg-primary/5 dark:bg-primary/10 border-primary/20">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-shield-check"
                  class="w-5 h-5"
                />
                <h3 class="font-semibold">
                  {{ page.cta?.title }}
                </h3>
              </div>
            </template>
            <p class="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
              {{ page.cta?.description }}
            </p>
            <div class="flex flex-wrap">
              <span
                v-for="button in page.cta?.buttons"
                :key="button.label"
              >
                <UButton
                  :to="button.to"
                  color="primary"
                  variant="soft"
                  icon="i-lucide-arrow-right"
                  trailing
                >
                  {{ button.label }}
                </UButton>
              </span>
            </div>
          </UCard>
        </div>
      </UPageBody>
    </UContainer>
  </UPage>
</template>
