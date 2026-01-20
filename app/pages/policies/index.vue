<template>
  <UContainer v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
    />

    <div v-if="policies?.length">
      <UPageBody>
        <div class="space-y-6">
          <NuxtLink
            v-for="policy in policies"
            :key="policy.path"
            :to="policy.path"
            class="block p-6 border border-neutral-200 rounded-lg hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <ProseH2 class="my-0">{{ policy.title }}</ProseH2>
          </NuxtLink>
        </div>
      </UPageBody>
    </div>

    <div v-else>
      <p>No policies found.</p>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const { data: page } = await useAsyncData('policy', () => queryCollection('policy').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: policies } = await useAsyncData('policies', () => queryCollection('policies').all())
</script>

<style>

</style>
