<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => queryCollection('policies').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const items: BreadcrumbItem[] = [
  {
    label: 'Policy Library',
    to: '/policies',
  },
  {
    label: page.value?.title,
    to: page.value?.path,
  },
]
</script>

<template>
  <UContainer>
    <UPage v-if="page">
      <UPageBody>
        <UBreadcrumb :items="items" />

        <ContentRenderer
          v-if="page.body"
          :value="page"
        />
      </UPageBody>

      <template
        v-if="page?.body?.toc?.links?.length"
        #right
      >
        <UContentToc :links="page.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
