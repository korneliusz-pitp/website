<script setup lang="ts">
const { data: home } = await useAsyncData("homepage", () =>
  queryCollection("homepage").first()
);

if (!home.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Homepage not found",
    fatal: true,
  });
}

useSeoMeta({
  title: home.value.title,
  description: home.value.description,
});
</script>

<template>
  <UPage v-if="home">
    <!-- Hero Section -->
    <UPageHero
      v-if="home.hero"
      :headline="home.hero.headline"
      :title="home.hero.title"
      :description="home.hero.description"
      :links="home.hero.links"
      :orientation="home.hero.orientation"
    >
      <template v-if="home.hero.image" #default>
        <NuxtImg
          :src="home.hero.image"
          :alt="home.hero.imageAlt || home.hero.title"
          class="w-full max-w-lg"
        />
      </template>
    </UPageHero>

    <UContainer>
      <UPageBody>
        <!-- Content Sections -->
        <template v-if="home.sections && home.sections.length > 0">
          <UPageSection
            v-for="(section, index) in home.sections"
            :key="index"
            :headline="section.headline"
            :icon="section.icon"
            :title="section.title"
            :description="section.description"
            :orientation="section.image ? 'horizontal' : 'vertical'"
            :reverse="section.reverse"
            :features="section.features"
            :links="section.links"
          >
            <template v-if="section.image" #default>
              <NuxtImg
                :src="section.image"
                :alt="section.imageAlt || section.title"
                class="w-full rounded-lg shadow-lg"
              />
            </template>
          </UPageSection>
        </template>

        <!-- Features Grid -->
        <div v-if="home.features" class="my-16">
          <div class="text-center mb-12">
            <ProseH2>{{ home.features.title }}</ProseH2>
            <ProseP v-if="home.features.description" class="text-lg">
              {{ home.features.description }}
            </ProseP>
          </div>
          <UPageGrid>
            <UPageCard
              v-for="(item, index) in home.features.items"
              :key="index"
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
              :to="item.to"
              :target="item.target"
              :orientation="item.orientation"
              :highlight="item.highlight"
              :highlight-color="item.highlightColor"
              :spotlight="item.spotlight"
            />
          </UPageGrid>
        </div>

        <!-- Stats Section -->
        <div v-if="home.stats" class="my-16">
          <ProseH2 v-if="home.stats.title" class="text-center mb-8">
            {{ home.stats.title }}
          </ProseH2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div
              v-for="(stat, index) in home.stats.items"
              :key="index"
              class="text-center"
            >
              <UIcon
                v-if="stat.icon"
                :name="stat.icon"
                class="w-12 h-12 mx-auto mb-4 text-primary"
              />
              <div class="text-4xl font-bold text-primary mb-2">
                {{ stat.value }}
              </div>
              <div class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <UPageCTA
          v-if="home.callToAction"
          :title="home.callToAction.title"
          :description="home.callToAction.description"
          :links="home.callToAction.buttons ?? []"
        />
      </UPageBody>
    </UContainer>
  </UPage>
</template>
