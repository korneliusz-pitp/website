<template>
  <UHeader
    v-if="headerConfig"
    :title="headerConfig.title"
    :to="headerConfig.to"
    :toggle="headerConfig.toggle"
  >
    <!-- Title/Logo Slot -->
    <template #title>
      <NuxtLink :to="headerConfig.to || '/'" class="flex items-center gap-2">
        <span class="font-bold text-lg">{{ headerConfig.title }}</span>
      </NuxtLink>
    </template>

    <!-- Navigation - Desktop & Mobile -->
    <div v-if="navigationItems.length > 0" class="hidden lg:flex">
      <UNavigationMenu :items="navigationItems" content-orientation="vertical" />
    </div>

    <!-- Right Slot - Buttons (Desktop) & Color Mode Toggle -->
    <template #right>
      <div v-if="buttons.length > 0" class="hidden lg:flex items-center gap-2">
        <UButton
          v-for="button in buttons"
          :key="button.label"
          :label="button.label"
          :to="button.to"
          :href="button.href"
          :target="button.target"
          :color="button.color || 'primary'"
          :variant="button.variant || 'solid'"
          :size="button.size || 'md'"
          :icon="button.icon"
        />
      </div>
      <UColorModeButton />
    </template>

    <!-- Navigation - Mobile Vertical with Buttons -->
    <template #body>
      <div v-if="navigationItems.length > 0">
        <UNavigationMenu :items="navigationItems" orientation="vertical" class="-mx-2.5" />
      </div>
      <div v-if="buttons.length > 0" class="flex flex-col gap-2 mt-4">
        <UButton
          v-for="button in buttons"
          :key="button.label"
          :label="button.label"
          :to="button.to"
          :href="button.href"
          :target="button.target"
          :color="button.color || 'primary'"
          :variant="button.variant || 'solid'"
          :size="button.size || 'md'"
          :icon="button.icon"
          block
        />
      </div>
    </template>
  </UHeader>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem, ButtonProps } from '@nuxt/ui'

// Fetch header configuration from Nuxt Content with SSR support
const { data: headerConfig } = await useAsyncData('header-config', () => useHeaderConfig())

// Build navigation items with native children support
const navigationItems = computed<NavigationMenuItem[]>(() => {
  if (!headerConfig.value?.links) {
    return []
  }

  const route = useRoute()

  return headerConfig.value.links.map(link => ({
    active: link.to ? (route.path === link.to || route.path.startsWith(link.to + '/')) : false,
    ...link,
  }))
})

// Extract buttons from header config
const buttons = computed<ButtonProps[]>(() => {
  return headerConfig.value?.buttons || []
})
</script>