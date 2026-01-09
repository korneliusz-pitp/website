<script setup lang="ts">
interface EventCardProps {
  title?: string;
  description?: string;
  date?: string;
  time?: {
    start?: string;
    end?: string;
  };
  location?: {
    name?: string;
    address?: string;
  };
  status?: "draft" | "published" | "cancelled";
  coverImage?: string;
  to?: string;
  orientation?: "vertical" | "horizontal";
}

const props = withDefaults(defineProps<EventCardProps>(), {
  title: undefined,
  description: undefined,
  date: undefined,
  time: undefined,
  location: undefined,
  status: "draft",
  coverImage: undefined,
  to: undefined,
  orientation: "vertical",
});

const computedDateTime = computed(() => {
  if (!props.date) {
    return {
      formattedDate: null,
      formattedTimeRange: null,
      isUpcoming: false,
      isPast: false,
    };
  }
  return getEventDateTime(props.date, props.time);
});
</script>

<template>
  <NuxtLink
    :to="to"
    class="group block transition-all duration-300"
    :class="[
      orientation === 'horizontal'
        ? 'opacity-100'
        : 'opacity-75 hover:opacity-100',
      status === 'published' && !computedDateTime.isPast
        ? ''
        : 'opacity-75 hover:opacity-100',
    ]"
  >
    <div
      :class="[
        'flex gap-4 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-950 hover:shadow-lg transition-shadow',
        orientation === 'horizontal' && 'md:flex-row',
        orientation === 'vertical' && 'flex-col',
      ]"
    >
      <!-- Cover Image -->
      <div
        v-if="coverImage"
        :class="[
          'relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 shrink-0',
          orientation === 'horizontal' ? 'w-48 h-48' : 'w-full h-48',
        ]"
      >
        <NuxtImg
          :src="coverImage"
          :alt="title"
          :class="[
            'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300',
            status !== 'published' || computedDateTime.isPast
              ? 'grayscale group-hover:grayscale-0'
              : '',
          ]"
        />
      </div>

      <!-- Event Details -->
      <div
        :class="[
          'flex flex-col justify-between p-4 flex-1',
          orientation === 'horizontal' && 'md:p-6',
        ]"
      >
        <!-- Header with Status Badge -->
        <div>
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex-1">
              <h3
                class="text-lg md:text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-primary transition-colors"
              >
                {{ title }}
              </h3>
            </div>
            <div class="shrink-0">
              <UBadge
                v-if="status === 'published' && computedDateTime.isUpcoming"
                color="primary"
                size="sm"
                label="Upcoming"
              />
              <UBadge
                v-else-if="status === 'published' && computedDateTime.isPast"
                color="neutral"
                size="sm"
                label="Past"
              />
              <UBadge
                v-else-if="status === 'cancelled'"
                color="error"
                size="sm"
                label="Cancelled"
              />
            </div>
          </div>

          <p
            v-if="description"
            class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2"
          >
            {{ description }}
          </p>
        </div>

        <!-- Event Info -->
        <div class="space-y-2 text-sm mt-4">
          <!-- Date & Time -->
          <div class="space-y-1">
            <div
              v-if="date"
              class="flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
            >
              <UIcon name="i-lucide-calendar" class="w-4 h-4 shrink-0" />
              <span>{{ computedDateTime.formattedDate }}</span>
            </div>
            <div
              v-if="time?.start || time?.end"
              class="flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
            >
              <UIcon name="i-lucide-clock" class="w-4 h-4 shrink-0" />
              <span>{{ computedDateTime.formattedTimeRange }}</span>
            </div>
          </div>

          <!-- Location -->
          <div
            v-if="location?.name"
            class="flex items-start gap-2 text-neutral-700 dark:text-neutral-300"
          >
            <UIcon name="i-lucide-map-pin" class="w-4 h-4 shrink-0 mt-0.5" />
            <span>{{ location.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
