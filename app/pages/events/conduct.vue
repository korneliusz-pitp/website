<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const { data: rules } = await useAsyncData('rules', () => queryCollection('rules').first())

if (!rules.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Rules page not found',
    fatal: true,
  })
}

useSeoMeta({
  title: rules.value.title,
  description: rules.value.description,
})

const accordionItems = computed<AccordionItem[]>(() => {
  if (!rules.value?.keyRules) return []
  return rules.value.keyRules.map((rule, index) => ({
    label: rule.label,
    icon: rule.icon,
    value: String(index),
  }))
})

const getKeyRuleContent = (index: number): string[] => {
  return rules.value?.keyRules?.[index]?.content ?? []
}
</script>

<template>
  <UPage v-if="rules">
    <UContainer>
      <!-- Page Header -->
      <UPageHeader
        :title="rules.title"
        :description="rules.description"
      />

      <!-- Introduction -->
      <UPageBody>
        <ProseP v-if="rules.intro">
          {{ rules.intro }}
        </ProseP>    

        <!-- Permitted & Prohibited Cards Side by Side -->
        <div v-if="rules.permittedGear || rules.prohibitedItems">
          <UPageGrid>
            <!-- Permitted Gear Card (Green/Success) -->
            <RulesCard
              v-if="rules.permittedGear"
              :title="rules.permittedGear.title"
              :icon="rules.permittedGear.icon"
              :items="rules.permittedGear.items"
              :item-icon="rules.permittedGear.itemIcon || 'i-lucide-check'"
              color="success"
            />

            <!-- Prohibited Items Card (Red/Error) -->
            <RulesCard
              v-if="rules.prohibitedItems"
              :title="rules.prohibitedItems.title"
              :icon="rules.prohibitedItems.icon"
              :items="rules.prohibitedItems.items"
              :item-icon="rules.prohibitedItems.itemIcon || 'i-lucide-x'"
              color="error"
            />
          </UPageGrid>
        </div>

        <!-- Key Rules Accordion -->
        <div v-if="accordionItems.length > 0">
          <ProseH2>Key Rules</ProseH2>
          <UAccordion
            :items="accordionItems"
            type="multiple"
          >
            <template #body="{ item }">
              <ProseUl v-if="getKeyRuleContent(Number(item.value)).length > 1">
                <ProseLi v-for="(line, idx) in getKeyRuleContent(Number(item.value))" :key="idx">
                  <MDC :value="line" />
                </ProseLi>
              </ProseUl>
              <ProseP v-else>
                {{ getKeyRuleContent(Number(item.value))[0] }}
              </ProseP>
            </template>
          </UAccordion>
        </div>

        <!-- Call to Action -->
        <UPageCTA
          v-if="rules.callToAction"
          :title="rules.callToAction.title"
          :description="rules.callToAction.description"
          :links="rules.callToAction.button ? [rules.callToAction.button] : []"
        />

        <!-- Contact Info -->
        <div v-if="rules.contactEmail">
          <ProseP>
            For questions about this policy, contact us at
            <UButton
              :label="rules.contactEmail"
              :to="`mailto:${rules.contactEmail}`"
              variant="link"
              color="primary"
            />
          </ProseP>
        </div>
      </UPageBody>
    </UContainer>
  </UPage>
</template>
