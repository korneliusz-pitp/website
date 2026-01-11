<script setup lang="ts">
const { data: about } = await useAsyncData("about-page", () =>
  queryCollection("about").first()
);

const { data: team } = await useAsyncData("team-members", () =>
  queryCollection("team").all()
);

useSeoMeta({
  title: about.value?.title,
  description: about.value?.description,
});

if (!about.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const carouselItems = computed(() => {
  return (
    about.value?.values?.map((value, idx) => ({
      id: idx,
      slot: `slide-${idx}`,
    })) || []
  );
});
</script>

<template>
  <UPage v-if="about">
    <UContainer>
      <!-- Page Header -->
      <UPageHero :title="about.title" :description="about.description" />

      <!-- Page Body -->
      <UPageBody>
        <!-- Intro -->
        <ProseP v-if="about.intro">
          {{ about.intro }}
        </ProseP>

        <!-- Mission Section -->
        <div v-if="about.mission" class="my-8">
          <ProseH2>{{ about.mission.title }}</ProseH2>
          <ProseP>{{ about.mission.content }}</ProseP>
        </div>

        <!-- Values Carousel -->
        <div v-if="about.values && about.values.length > 0" class="my-8">
          <ProseH2>Our Values</ProseH2>
          <UCarousel
            v-slot="{ item }"
            loop
            arrows
            dots
            :autoplay="{ delay: 2000 }"
            :items="carouselItems"
            :ui="{
              item: 'sm:basis-1/2 lg:basis-1/3',
              prev: 'sm:start-4 lg:-start-12',
              next: 'sm:end-4 lg:-end-12',
            }"
          >
            <div
              v-if="about.values?.[item.id]"
              class="h-80 flex flex-col justify-center items-center p-8 bg-linear-to-br from-primary/10 to-secondary/10"
            >
              <UIcon
                :name="about.values?.[item.id]?.icon"
                class="w-16 h-16 mb-4 text-primary"
              />
              <ProseH3 class="text-center mb-4">
                {{ about.values?.[item.id]?.label }}
              </ProseH3>
              <ProseP class="text-center text-sm max-w-xs">
                {{ about.values?.[item.id]?.description }}
              </ProseP>
            </div>
          </UCarousel>
        </div>

        <!-- Meet the Team Section -->
        <div v-if="team && team.length > 0" class="my-8">
          <ProseH2>Meet the Team</ProseH2>
          <div class="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
            <UCard
              v-for="member in team"
              :key="member.name"
              class="flex flex-col text-center"
            >
              <!-- Team Member Image -->
              <div v-if="member.image" class="mb-4">
                <NuxtImg
                  :src="member.image"
                  :alt="member.name"
                  class="w-24 h-24 rounded-lg object-cover mx-auto"
                />
              </div>

              <!-- Team Member Info -->
              <div class="grow">
                <ProseH4 class="mt-0! mb-1">{{ member.name }}</ProseH4>
                <ProseP class="text-xs font-semibold text-primary mb-2">
                  {{ member.role }}
                </ProseP>
                <ProseP v-if="member.bio" class="text-xs mb-3 line-clamp-5">
                  {{ member.bio }}
                </ProseP>

                <!-- Socials -->
                <div
                  v-if="member.socials && member.socials.length > 0"
                  class="flex gap-2 justify-center"
                >
                  <UButton
                    v-for="social in member.socials"
                    :key="social.label"
                    :to="social.url"
                    :aria-label="social.label"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :icon="social.icon"
                    target="_blank"
                  />
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Call to Action -->
        <UPageCTA
          v-if="about.callToAction"
          :title="about.callToAction.title"
          :description="about.callToAction.description"
          :links="about.callToAction.buttons ?? []"
        />
      </UPageBody>
    </UContainer>
  </UPage>
</template>
