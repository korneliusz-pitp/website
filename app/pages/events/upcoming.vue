<script setup lang="ts">
useSeoMeta({
  title: 'Upcoming Events',
  description: 'View all upcoming Pups in the Park events and meetups.',
})

const { data: events } = await useAsyncData('upcoming-events', () =>
  queryCollection('events')
    .where('status', '=', 'published')
    .orWhere(query =>
      query
        .where('date', '>', new Date().toISOString())
        .where('date', 'IS NULL'),
    )
    .order('date', 'ASC')
    .all(),
)

console.log('Upcoming events:', events.value)

if (!events.value || events.value.length === 0) {
  throw navigateTo('/events', { replace: true, redirectCode: 307 })
}
else if (events.value.length == 1 && events.value[0]?.path) {
  throw navigateTo(events.value[0].path, { replace: true, redirectCode: 307 })
}
</script>

<template>
  <UPage>
    {{ events?.length }}
    <UContainer>
      <!-- Page Header -->
      <UPageHero
        title="Upcoming Events"
        description="Explore all upcoming Pups in the Park community events and gatherings"
      />

      <UPageBody>
        <div class="space-y-6">
          <!-- Multiple Events: Display as Grid -->
          <div class="grid gap-6 lg:grid-cols-2">
            <EventCard
              v-for="event in events"
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
      </UPageBody>
    </UContainer>
  </UPage>
</template>
