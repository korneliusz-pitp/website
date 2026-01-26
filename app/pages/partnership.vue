<script setup lang="ts">
const { data: partnership } = await useAsyncData('partnership', () =>
  queryCollection('partnership').first(),
)

if (!partnership.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}

useSeoMeta({
  title: partnership.value.title,
  description: partnership.value.description,
})
</script>

<template>
  <UPage v-if="partnership">
    <UContainer>
      <!-- Page Header -->
      <UPageHero
        v-if="partnership.hero"
        :title="partnership.hero.title"
        :description="partnership.hero.description"
      >
        <template
          v-if="partnership.hero.image"
          #default
        >
          <NuxtImg
            :src="partnership.hero.image"
            :alt="partnership.hero.imageAlt || partnership.hero.title"
            class="w-full max-w-lg mx-auto rounded-4xl shadow-xl"
          />
        </template>
      </UPageHero>

      <UPageBody>
        <!-- Intro -->
        <ProseP
          v-if="partnership.intro"
          class="text-lg"
        >
          {{ partnership.intro }}
        </ProseP>

        <!-- Content Sections -->
        <template v-if="partnership.sections && partnership.sections.length > 0">
          <UPageSection
            v-for="(section, index) in partnership.sections"
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
            <template
              v-if="section.image"
              #default
            >
              <img
                :src="section.image"
                :alt="section.imageAlt || section.title"
                class="w-full rounded-4xl object-cover"
              >
            </template>
          </UPageSection>
        </template>

        <!-- Benefits Grid -->
        <div
          v-if="partnership.benefits"
          class="my-16"
        >
          <div class="text-center mb-12">
            <ProseH2>{{ partnership.benefits.title }}</ProseH2>
            <ProseP
              v-if="partnership.benefits.description"
              class="text-lg"
            >
              {{ partnership.benefits.description }}
            </ProseP>
          </div>
          <UPageGrid>
            <UPageCard
              v-for="(item, index) in partnership.benefits.items"
              :key="index"
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
            />
          </UPageGrid>
        </div>

        <!-- Requirements Section -->
        <div
          v-if="partnership.requirements"
          class="my-16"
        >
          <ProseH2 class="text-center mb-8">
            {{ partnership.requirements.title }}
          </ProseH2>
          <UPageGrid>
            <!-- Content Creators -->
            <UCard v-if="partnership.requirements.contentCreators">
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-lucide-video"
                    class="w-6 h-6 text-primary"
                  />
                  <div class="font-semibold">
                    Content Creators
                  </div>
                </div>
              </template>
              <ProseUl>
                <ProseLi
                  v-for="(req, idx) in partnership.requirements.contentCreators"
                  :key="idx"
                >
                  {{ req }}
                </ProseLi>
              </ProseUl>
            </UCard>

            <!-- Businesses -->
            <UCard v-if="partnership.requirements.businesses">
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-lucide-briefcase"
                    class="w-6 h-6 text-secondary"
                  />
                  <div class="font-semibold">
                    Businesses
                  </div>
                </div>
              </template>
              <ProseUl>
                <ProseLi
                  v-for="(req, idx) in partnership.requirements.businesses"
                  :key="idx"
                >
                  {{ req }}
                </ProseLi>
              </ProseUl>
            </UCard>
          </UPageGrid>
        </div>

        <!-- Call to Action -->
        <UPageCTA
          v-if="partnership.callToAction"
          :title="partnership.callToAction.title"
          :description="partnership.callToAction.description"
          :links="partnership.callToAction.buttons ?? []"
        />

        <!-- Contact Info -->
        <div v-if="partnership.contactEmail">
          <ProseP class="text-center">
            For business enquiries, contact us at
            <UButton
              :label="partnership.contactEmail"
              :to="`mailto:${partnership.contactEmail}`"
              variant="link"
              color="primary"
            />
          </ProseP>
        </div>
      </UPageBody>
    </UContainer>
  </UPage>
</template>
