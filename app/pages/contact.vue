<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

const { data: contact } = await useAsyncData("contact-page", () =>
  queryCollection("contact").first()
);

if (!contact.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: contact.value.title,
  description: contact.value.description,
});

// Group contact methods by priority
const priorityContacts = computed(
  () =>
    contact.value?.contactMethods?.filter((m) => m.priority === "high") ?? []
);

const regularContacts = computed(
  () =>
    contact.value?.contactMethods?.filter(
      (m) => !m.priority || m.priority === "normal"
    ) ?? []
);

const faqItems = computed<AccordionItem[]>(() => {
  if (!contact.value?.faq?.items) return [];
  return contact.value.faq.items.map((item, idx) => ({
    label: item.question,
    value: String(idx),
  }));
});

const getFaqAnswer = (index: number) => {
  return contact.value?.faq?.items?.[index];
};
</script>

<template>
  <UPage v-if="contact">
    <UContainer>
      <UPageHeader :title="contact.title" :description="contact.description" />

      <UPageBody>
        <!-- Intro -->
        <ProseP v-if="contact.intro" class="text-lg">
          {{ contact.intro }}
        </ProseP>

        <!-- Priority Contacts (Safeguarding) -->
        <div v-if="priorityContacts.length" class="my-8 space-y-4">
          <UAlert
            v-for="method in priorityContacts"
            :key="method.email"
            color="warning"
            variant="subtle"
            :icon="method.icon"
            :title="method.department"
            :description="method.description"
          >
            <template #actions>
              <UButton
                :to="`mailto:${method.email}`"
                external
                icon="i-heroicons-envelope"
                color="warning"
                variant="outline"
                size="xs"
              >
                {{ method.email }}
              </UButton>
            </template>
          </UAlert>
        </div>

        <!-- Regular Contact Methods -->
        <div v-if="regularContacts.length" class="my-8">
          <ProseH2>Get In Touch</ProseH2>
          <div class="grid gap-4 md:grid-cols-2">
            <UCard v-for="method in regularContacts" :key="method.email">
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    v-if="method.icon"
                    :name="method.icon"
                    class="w-6 h-6 text-primary"
                  />
                  <h3 class="text-lg font-semibold">{{ method.department }}</h3>
                </div>
              </template>
              <p v-if="method.description">
                {{ method.description }}
              </p>
              <template #footer>
                <UButton
                  :to="`mailto:${method.email}`"
                  external
                  icon="i-heroicons-envelope"
                  color="primary"
                  variant="outline"
                >
                  {{ method.email }}
                </UButton>
              </template>
            </UCard>
          </div>
        </div>

        <!-- Social Connections -->
        <div v-if="contact.socialConnections" class="my-8">
          <ProseH2>{{ contact.socialConnections.title }}</ProseH2>
          <ProseP v-if="contact.socialConnections.description">
            {{ contact.socialConnections.description }}
          </ProseP>
          <div class="flex flex-wrap gap-3 mt-4">
            <UButton
              v-for="link in contact.socialConnections.links"
              :key="link.label"
              :to="link.to"
              :icon="link.icon"
              :color="link.color"
              :variant="link.variant"
              external
            >
              {{ link.label }}
            </UButton>
          </div>
        </div>

        <!-- FAQ Accordion -->
        <div v-if="contact.faq" class="my-8">
          <ProseH2>{{ contact.faq.title }}</ProseH2>
          <UAccordion :items="faqItems" type="multiple">
            <template #body="{ item }">
              <div class="flex items-center gap-1 flex-wrap">
                <p>{{ getFaqAnswer(Number(item.value))?.answer }}</p>
                <UButton
                  v-if="getFaqAnswer(Number(item.value))?.link"
                  :to="getFaqAnswer(Number(item.value))?.link"
                  variant="link"
                  trailing-icon="i-heroicons-arrow-right"
                >
                  Learn more
                </UButton>
              </div>
            </template>
          </UAccordion>
        </div>
      </UPageBody>
    </UContainer>
  </UPage>
</template>
