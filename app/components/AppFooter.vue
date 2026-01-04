<template>
  <UFooter
    :ui="{
      root: 'border-t-4 border-primary-950',
    }"
  >
    <template #top>
      <UContainer>
        <UFooterColumns 
          :columns="footerColumns"
          :ui="{ center: 'xl:justify-items-end' }"
        >
          <template #left>
            <ProseH1>{{ brandTitle }}</ProseH1>
            <ProseP v-for="line in brandDescription" :key="line" size="sm">{{ line }}</ProseP>

            <div class="flex gap-1">
              <UButton
                v-for="social in socials"
                :key="social.label"
                :aria-label="social.label"
                :to="social.to"
                :href="social.href"
                :target="social.target || '_blank'"
                :icon="social.icon"
                color="neutral"
                variant="link"
                square
              />
            </div>
          </template>

          <template #column-label="{ column }">
            <ProseH2 class="mt-0">{{ column.label }}</ProseH2>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <ProseP>© {{ year }} {{ brandTitle }} | All Rights Reserved.</ProseP>
    </template>

    <template #right>
      <div class="flex items-center gap-2">
        <UButton
          to="/_studio"
          icon="i-heroicons-pencil"
          color="neutral"
          variant="link"
          square
          aria-label="Edit content in Studio"
        />
        <ProseP>{{ footnote }}</ProseP>
      </div>
    </template>
  </UFooter>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FooterConfig } from '~/composables/useFooterConfig'
import { useFooterConfig } from '~/composables/useFooterConfig'
import type { FooterColumn } from '@nuxt/ui'

const { data: footerConfig } = await useAsyncData<FooterConfig>('footer-config', () => useFooterConfig())

const brandTitle = computed(() => footerConfig.value?.brand?.title || 'Pups in the Park')
const brandDescription = computed(() => footerConfig.value?.brand?.description || [])
const socials = computed(() => footerConfig.value?.socials || [])
const quickLinks = computed(() => footerConfig.value?.quickLinks || [])
const contacts = computed(() => footerConfig.value?.contacts || [])
const footnote = computed(() => footerConfig.value?.footnote || 'All rights reserved. | Designed in the UK.')

const footerColumns = computed<FooterColumn[]>(() => [
  {
    label: 'Quick Links',
    children: quickLinks.value
  },
  {
    label: 'Contact',
    children: contacts.value.map(contact => ({
      label: contact.email,
      href: `mailto:${contact.email}`,
      icon: contact.icon
    }))
  }
])

const year = new Date().getFullYear()
</script>