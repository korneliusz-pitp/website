<script setup lang="ts">
const { data: report } = await useAsyncData("report-page", () =>
  queryCollection("report").first()
);

if (!report.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: report.value.title,
  description: report.value.description,
  robots: "noindex", // Prevent indexing for sensitive page
});

const formHeight = computed(
  () => `${report.value?.formInfo?.googleFormHeight ?? 1200}px`
);
</script>

<template>
  <UPage v-if="report">
    <UContainer>
      <UPageHeader :title="report.title" :description="report.description" />

      <UPageBody>
        <!-- Emergency Alert -->
        <UAlert
          v-if="report.urgency"
          color="error"
          variant="subtle"
          icon="i-heroicons-exclamation-triangle"
          :title="report.urgency.title"
          :description="report.urgency.emergency.description"
          class="mb-8"
        >
          <template #actions>
            <div class="flex flex-wrap gap-2 mt-2">
              <UButton
                v-for="action in report.urgency.emergency.actions"
                :key="action.label"
                :label="action.label"
                :icon="action.icon"
                :color="action.color"
                :variant="action.variant"
                size="md"
              />
            </div>
          </template>
        </UAlert>

        <!-- Non-Emergency Notice -->
        <UCard v-if="report.urgency.nonEmergency" class="mb-8 bg-primary/5">
          <p class="font-medium">
            {{ report.urgency.nonEmergency.description }}
          </p>
        </UCard>

        <!-- What to Report -->
        <div v-if="report.whatToReport" class="my-8">
          <ProseH2>{{ report.whatToReport.title }}</ProseH2>
          <div class="grid gap-4 md:grid-cols-3 mt-4">
            <UCard
              v-for="category in report.whatToReport.categories"
              :key="category.label"
            >
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon
                    v-if="category.icon"
                    :name="category.icon"
                    class="w-5 h-5 text-secondary"
                  />
                  <h3 class="font-semibold">{{ category.label }}</h3>
                </div>
              </template>
              <p class="text-sm mb-3">{{ category.description }}</p>
              <ul class="text-sm text-muted-foreground space-y-1">
                <li
                  v-for="example in category.examples"
                  :key="example"
                  class="flex items-start gap-2"
                >
                  <UIcon
                    name="i-heroicons-check-circle"
                    class="w-4 h-4 mt-0.5 text-success shrink-0"
                  />
                  <span>{{ example }}</span>
                </li>
              </ul>
            </UCard>
          </div>
        </div>

        <!-- Google Form Embed -->
        <div v-if="report.formInfo" class="my-8">
          <ProseH2>{{ report.formInfo.title }}</ProseH2>
          <ProseP class="mb-4">{{ report.formInfo.intro }}</ProseP>

          <div class="border-2 border-neutral rounded-lg overflow-hidden">
            <iframe
              :src="report.formInfo.googleFormUrl"
              :height="formHeight"
              frameborder="0"
              marginheight="0"
              marginwidth="0"
              class="w-full"
            >
              Loading form...
            </iframe>
          </div>

          <UAlert
            v-if="report.formInfo.submissionNote"
            color="info"
            variant="subtle"
            icon="i-heroicons-information-circle"
            :description="report.formInfo.submissionNote"
            class="mt-4"
          />
        </div>

        <!-- Support Resources -->
        <div v-if="report.supportResources" class="my-8">
          <ProseH2>{{ report.supportResources.title }}</ProseH2>
          <ProseP v-if="report.supportResources.description">
            {{ report.supportResources.description }}
          </ProseP>
          <div class="grid gap-4 md:grid-cols-3 mt-4">
            <UCard
              v-for="resource in report.supportResources.resources"
              :key="resource.label"
              class="text-center"
            >
              <UIcon
                v-if="resource.icon"
                :name="resource.icon"
                class="w-8 h-8 mx-auto mb-3 text-secondary"
              />
              <h3 class="font-semibold mb-1">{{ resource.label }}</h3>
              <p class="text-sm text-muted-foreground mb-2">
                {{ resource.description }}
              </p>
              <p class="text-lg font-mono text-primary">
                {{ resource.contact }}
              </p>
            </UCard>
          </div>
        </div>

        <!-- Related Policies -->
        <div v-if="report.relatedPolicies" class="my-8">
          <ProseH2>{{ report.relatedPolicies.title }}</ProseH2>
          <div class="flex flex-wrap gap-3 mt-4">
            <UButton
              v-for="policy in report.relatedPolicies.links"
              :key="policy.to"
              :to="policy.to"
              :icon="policy.icon"
              color="neutral"
              variant="outline"
            >
              {{ policy.label }}
            </UButton>
          </div>
        </div>
      </UPageBody>
    </UContainer>
  </UPage>
</template>
