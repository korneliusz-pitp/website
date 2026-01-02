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
  title: 'Upcoming Events',
  description: 'View all upcoming Pups in the Park events and meetups.',
})

const router = useRouter()

const { data: events } = await useAsyncData('upcoming-events', () =>
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

// Handle redirects based on event count
watch(
  () => upcomingEvents.value.length,
  (count) => {
    if (count === 0) {
      // No events: redirect to main events page
      navigateTo('/events')
    } else if (count === 1 && upcomingEvents.value[0]?._path) {
      // Single event: redirect to that event's page
      navigateTo(upcomingEvents.value[0]._path)
    }
  },
  { immediate: true },
)
</script>

<template>
  <UPage>
    <UContainer>
      <!-- Page Header -->
      <UPageHero
        title="Upcoming Events"
        description="Explore all upcoming Pups in the Park community events and gatherings"
      />

      <UPageBody>
        <div v-if="upcomingEvents.length > 1" class="space-y-6">
          <!-- Multiple Events: Display as Grid -->
          <div class="grid gap-6 lg:grid-cols-2">
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
              :to="event._path"
              orientation="vertical"
            />
          </div>
        </div>
        <!-- Single event or no events: handled by redirects -->
      </UPageBody>
    </UContainer>
  </UPage>
</template>
