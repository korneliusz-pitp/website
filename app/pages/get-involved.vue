<script setup lang="ts">
import type { TimelineItem } from "@nuxt/ui";

const { data: involved } = await useAsyncData("get-involved", () =>
  queryCollection("get_involved").first()
);

const { data: roles } = await useAsyncData("volunteer-roles", () =>
  queryCollection("volunteer_roles").all()
);

if (!involved.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: involved.value?.title,
  description: involved.value?.description,
});

const timelineItems = computed<TimelineItem[]>(() => {
  const steps = involved.value?.timeline ?? [];
  return steps.map((step, index) => ({
    title: step.title,
    description: step.description,
    icon: step.icon,
    value: index,
  }));
});
</script>

<template>
  <UPage v-if="involved">
    <UContainer>
      <!-- Page Header -->
      <UPageHeader
        :title="involved.title"
        :description="involved.description"
      />

      <UPageBody>
        <!-- Intro -->
        <ProseP v-if="involved.intro">
          {{ involved.intro }}
        </ProseP>

        <!-- Roles -->
        <VolunteerRoles :roles="roles ?? []" />

        <!-- Application Timeline -->
        <div v-if="timelineItems.length > 0" class="my-6">
          <ProseH2>Application Timeline</ProseH2>
          <UTimeline size="md" :items="timelineItems" />
        </div>

        <!-- Contact CTA -->
        <UPageCTA
          v-if="involved.callToAction"
          :title="involved.callToAction.title"
          :description="involved.callToAction.description"
          :links="involved.callToAction.buttons ?? []"
        />
      </UPageBody>
    </UContainer>
  </UPage>
</template>
