<script setup lang="ts">
type ColorType = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

interface Props {
  title: string
  icon?: string
  items: string[]
  color?: ColorType
  itemIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  icon: 'i-lucide-list',
  itemIcon: 'i-lucide-circle',
})

const colorClasses: Record<ColorType, { icon: string; itemIcon: string }> = {
  primary: {
    icon: 'text-primary',
    itemIcon: 'text-primary',
  },
  secondary: {
    icon: 'text-secondary',
    itemIcon: 'text-secondary',
  },
  success: {
    icon: 'text-success',
    itemIcon: 'text-success',
  },
  info: {
    icon: 'text-info',
    itemIcon: 'text-info',
  },
  warning: {
    icon: 'text-warning',
    itemIcon: 'text-warning',
  },
  error: {
    icon: 'text-error',
    itemIcon: 'text-error',
  },
  neutral: {
    icon: 'text-neutral',
    itemIcon: 'text-neutral',
  },
}

const currentColorClasses = computed(() => colorClasses[props.color])
</script>

<template>
  <UPageCard
    variant="outline"
    highlight
    :highlight-color="color"
    spotlight
    :spotlight-color="color"
  >
    <template #header>
      <div class="flex items-center gap-4">
        <UIcon
          :name="icon"
          :class="['size-10', currentColorClasses.icon]"
        />
        <ProseH3 class="mt-0">
          {{ title }}
        </ProseH3>
      </div>
    </template>

    <ul class="rules-card-list">
      <li v-for="item in items" :key="item" class="rules-card-item">
        <UIcon
          :name="itemIcon"
          :class="['rules-card-item-icon', currentColorClasses.itemIcon]"
        />
        <span>{{ item }}</span>
      </li>
    </ul>
  </UPageCard>
</template>
