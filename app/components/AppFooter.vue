<template>
  <UFooter
    :ui="{
      root: 'border-t-4 border-primary-950',
    }"
  >
    <template #top>
      <UContainer>
        <UFooterColumns
          v-if="footerConfig"
          :columns="footerColumns"
          :ui="{
            center: 'xl:justify-items-end',
            label: 'text-lg font-semibold text-highlighted mt-0',
          }"
        >
          <template #left>
            <h1 class="text-2xl font-bold text-highlighted mb-2">
              {{ brandTitle }}
            </h1>
            <p
              v-for="line in brandDescription"
              :key="line"
              class="text-sm text-muted mb-2"
            >
              {{ line }}
            </p>

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
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-sm text-muted">
        © {{ year }} {{ brandTitle }} | All Rights Reserved.
      </p>
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
          external
        />
        <p class="text-sm text-muted">{{ footnote }}</p>
      </div>
    </template>
  </UFooter>
</template>

<script lang="ts" setup>
import type { FooterConfig } from "~/composables/useFooterConfig";
import { useFooterConfig } from "~/composables/useFooterConfig";
import type { FooterColumn } from "@nuxt/ui";

const { data: footerConfig } = await useAsyncData<FooterConfig>(
  "footer-config",
  () => useFooterConfig()
);

const brandTitle = computed(
  () => footerConfig.value?.brand?.title || "Pups in the Park"
);
const brandDescription = computed(
  () => footerConfig.value?.brand?.description || []
);
const socials = computed(() => footerConfig.value?.socials || []);
const quickLinks = computed(() => footerConfig.value?.quickLinks || []);
const contacts = computed(() => footerConfig.value?.contacts || []);
const footnote = computed(
  () =>
    footerConfig.value?.footnote || "All rights reserved. | Designed in the UK."
);

const footerColumns = computed<FooterColumn[]>(() => [
  {
    label: "Quick Links",
    children: quickLinks.value,
  },
  {
    label: "Contact",
    children: contacts.value.map((contact) => ({
      label: contact.email,
      href: `mailto:${contact.email}`,
      icon: contact.icon,
    })),
  },
]);

// Use useState to ensure consistent value between server and client hydration
const year = useState("footer-year", () => new Date().getFullYear());
</script>
