<script setup lang="ts">
interface Event {
  date?: string
  time?: {
    start?: string
    end?: string
  }
  title?: string
  description?: string
  location?: {
    name?: string
    address?: string
  }
  status?: 'draft' | 'published' | 'cancelled'
  coverImage?: string
  _path?: string
}

useSeoMeta({
  title: 'Events',
  description: 'Discover Pups in the Park events, meetups and gatherings for the UK kemonomimi community.',
})

const { data: events } = await useAsyncData('events', () =>
  queryCollection('events')
    .where('status', '=', 'published')
    .all(),
)

const upcomingEvents = computed(() => {
  if (!events.value) return []
  return (events.value as Event[])
    .filter((event) => getEventDateTime(event.date, event.time).isUpcoming)
    .sort((a, b) => {
      const dateA = new Date(a.date || '')
      const dateB = new Date(b.date || '')
      return dateA.getTime() - dateB.getTime()
    })
})

const pastEvents = computed(() => {
  if (!events.value) return []
  return (events.value as Event[])
    .filter((event) => getEventDateTime(event.date, event.time).isPast)
    .sort((a, b) => {
      const dateA = new Date(a.date || '')
      const dateB = new Date(b.date || '')
      return dateB.getTime() - dateA.getTime()
    })
})
</script>

<template>
  <UPage>
    <UContainer>
      <!-- Page Header -->
      <UPageHero
        title="Events"
        description="Join the Pups in the Park community at our upcoming gatherings and meetups"
      />

      <UPageBody>
        <!-- Upcoming Events Section -->
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-4">Upcoming Events</h2>
            <div v-if="upcomingEvents.length > 0">
              <div
                :class="[
                  'grid gap-6',
                  upcomingEvents.length === 1 ? 'max-w-full' : 'lg:grid-cols-2',
                ]"
              >
                <EventCard
                  v-for="event in upcomingEvents"
                  :key="event._path"
                  :title="event.title"
                  :description="event.description"
                  :date="event.date"
                  :time="event.time"
                  :location="event.location"
                  :cover-image="event.coverImage"
                  :status="event.status"
                  :to="event.path"
                  :orientation="upcomingEvents.length === 1 ? 'horizontal' : 'vertical'"
                />
              </div>
            </div>
            <div v-else class="rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
              <UIcon name="i-lucide-calendar-off" class="w-12 h-12 mx-auto text-neutral-400 mb-3" />
              <p class="text-neutral-600 dark:text-neutral-400">No upcoming events scheduled yet.</p>
            </div>
          </div>

          <!-- Past Events Section -->
          <div v-if="pastEvents.length > 0">
            <h2 class="text-2xl font-bold mb-4">Past Events</h2>
            <div class="grid gap-6 lg:grid-cols-2">
              <EventCard
                v-for="event in pastEvents"
                :key="event._path"
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
                <UIcon name="i-lucide-shield-check" class="w-5 h-5" />
                <h3 class="font-semibold">Event Guidelines</h3>
              </div>
            </template>
            <p class="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
              Before attending, please review our community guidelines and what to bring.
            </p>
            <NuxtLink to="/events/conduct">
              <UButton color="primary" variant="soft" icon="i-lucide-arrow-right" trailing>
                View Guidelines
              </UButton>
            </NuxtLink>
          </UCard>
        </div>
      </UPageBody>
    </UContainer>
  </UPage>
</template>
