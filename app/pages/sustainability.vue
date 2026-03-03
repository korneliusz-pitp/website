<template>
  <UContainer>
    <UPage v-if="page">
      <!-- Falling Leaves Animation -->
      <div class="falling-leaves-container">
        <div
          v-for="leaf in leaves"
          :key="leaf.id"
          class="leaf"
          :style="leaf.style"
        >
          <NuxtImg
            v-if="page.leafImage"
            :src="page.leafImage"
            alt="Leaf"
            class="leaf-image"
          />
          <span v-else>🍃</span>
        </div>
      </div>

      <UPageHero
        :title="page.title"
        :description="page.description"
      >
        <NuxtImg
          :src="page.hero?.image"
          :alt="page.hero?.alt || 'Sustainability hero image'"
          class="w-full h-full object-cover"
        />
      </UPageHero>

      <UPageBody>
        <!-- Main Content Sections -->
        <UPageSection
          v-for="(section, index) in page.sections"
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
            <NuxtImg
              :src="section.image"
              :alt="section.imageAlt || section.title"
              class="w-full rounded-4xl object-cover"
            />
          </template>
        </UPageSection>

        <!-- Initiatives -->
        <UPageSection
          v-if="page.initiatives && page.initiatives.length > 0"
          title="Our Sustainability Initiatives"
          description="Measurable commitments to creating eco-friendly events that benefit both our community and the environment."
          :features="page.initiatives"
        />

        <!-- Call to Action -->
        <UPageCTA
          v-if="page.callToAction"
          :title="page.callToAction.title"
          :description="page.callToAction.description"
          :links="page.callToAction.buttons"
          variant="soft"
        />
      </UPageBody>
    </UPage>

    <div
      v-else
      class="flex items-center justify-center min-h-screen"
    >
      <p class="text-muted">
        Content not found
      </p>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const { data: page } = await useAsyncData('sustainability', () =>
  queryCollection('sustainability').first(),
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Sustainability page not found',
    fatal: true,
  })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
})

// Falling leaves animation
interface Leaf {
  id: number
  style: {
    'left': string
    '--fall-duration': string
    '--sway-duration': string
    'animationDelay': string
    'fontSize': string
    'opacity': string
    '--sway-distance': string
  }
}

const leaves = ref<Leaf[]>([])

onMounted(() => {
  // Generate random leaves with varied properties
  for (let i = 0; i < 15; i++) {
    const fallDuration = 8 + Math.random() * 10
    const swayDuration = 3 + Math.random() * 3
    leaves.value.push({
      id: i,
      style: {
        'left': `${Math.random() * 100}%`,
        '--fall-duration': `${fallDuration}s`,
        '--sway-duration': `${swayDuration}s`,
        'animationDelay': `${Math.random() * 5}s`,
        'fontSize': `${20 + Math.random() * 20}px`,
        'opacity': `${0.3 + Math.random() * 0.4}`,
        '--sway-distance': `${60 + Math.random() * 80}px`,
      },
    })
  }
})
</script>

<style scoped>
.falling-leaves-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.leaf {
  position: absolute;
  top: -100px;
  animation: fall var(--fall-duration, 12s) linear infinite,
             sway var(--sway-duration, 4s) ease-in-out infinite;
  pointer-events: none;
  will-change: transform;
}

.leaf-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

@keyframes fall {
  from {
    transform: translateY(0) rotate(0deg);
  }
  to {
    transform: translateY(calc(100vh + 200px)) rotate(360deg);
  }
}

@keyframes sway {
  0%,
  100% {
    margin-left: 0;
  }
  25% {
    margin-left: var(--sway-distance, 80px);
  }
  75% {
    margin-left: calc(var(--sway-distance, 80px) * -0.5);
  }
}

/* Ensure content is above the leaves */
:deep(.u-page) {
  position: relative;
  z-index: 1;
}
</style>
