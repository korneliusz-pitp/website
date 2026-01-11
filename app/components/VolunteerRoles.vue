<script setup lang="ts">
export type Role = {
  name: string;
  description?: string;
  icon?: string;
  available: boolean;
  colorHex?: string;
  link?: {
    label?: string;
    to?: string;
    icon?: string;
    target?: "_blank" | "_self";
  };
  apply?: { label?: string; to?: string; target?: "_blank" | "_self" };
  details?: {
    requirements?: string[];
    duties?: string[];
    contactEmail?: string;
  };
};

defineProps<{
  roles: Role[];
}>();

const isDetailsOpen = ref(false);
const selectedRole = ref<Role | null>(null);

const openDetails = (role: Role) => {
  selectedRole.value = role;
  isDetailsOpen.value = true;
};
</script>

<template>
  <div v-if="roles.length > 0" class="my-6">
    <ProseH2>Volunteer Roles</ProseH2>
    <UPageGrid>
      <UCard v-for="role in roles" :key="role.name" class="flex flex-col">
        <!-- Accent strip -->
        <div
          v-if="role.colorHex"
          class="h-1 w-full"
          :style="{ backgroundColor: role.colorHex }"
        />

        <!-- Header -->
        <div class="flex items-start gap-3 p-2">
          <UIcon
            v-if="role.icon"
            :name="role.icon"
            class="w-7 h-7"
            :style="role.colorHex ? { color: role.colorHex } : undefined"
          />
          <div class="grow">
            <div class="flex items-center justify-between gap-2">
              <ProseH4 class="mt-0! mb-1">{{ role.name }}</ProseH4>
              <UBadge
                :label="role.available ? 'Open' : 'Closed'"
                :color="role.available ? 'success' : 'neutral'"
                variant="subtle"
              />
            </div>

            <!-- Description -->
            <ProseP v-if="role.description" class="text-sm mb-2">
              {{ role.description }}
            </ProseP>
          </div>
        </div>

        <!-- Footer actions -->
        <div class="flex gap-2 p-2 pt-0">
          <UButton
            v-if="
              role.details &&
              (role.details.requirements?.length ||
                role.details.duties?.length ||
                role.details.contactEmail)
            "
            label="View details"
            icon="i-lucide-info"
            color="neutral"
            variant="ghost"
            @click="openDetails(role)"
          />
          <UButton
            v-if="role.available && role.apply?.to"
            :label="role.apply.label ?? 'Apply'"
            :to="role.apply.to"
            :trailing-icon="
              role.apply.target === '_blank'
                ? 'i-lucide-external-link'
                : undefined
            "
            :target="role.apply.target"
            color="primary"
            variant="solid"
          />
        </div>
      </UCard>
    </UPageGrid>

    <!-- Role Details Modal -->
    <UModal
      v-model:open="isDetailsOpen"
      :ui="{ content: 'max-w-2xl', footer: 'justify-end' }"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            v-if="selectedRole?.icon"
            :name="selectedRole?.icon"
            class="w-6 h-6"
            :style="
              selectedRole?.colorHex
                ? { color: selectedRole?.colorHex }
                : undefined
            "
          />
          <span class="font-semibold">{{ selectedRole?.name }} — Details</span>
        </div>
      </template>

      <template #body>
        <div class="space-y-6">
          <div v-if="selectedRole?.details?.requirements?.length">
            <ProseH4>Requirements</ProseH4>
            <ProseUl>
              <ProseLi
                v-for="(req, i) in selectedRole.details.requirements"
                :key="i"
                >{{ req }}</ProseLi
              >
            </ProseUl>
          </div>

          <div v-if="selectedRole?.details?.duties?.length">
            <ProseH4>Duties</ProseH4>
            <ProseUl>
              <ProseLi
                v-for="(duty, i) in selectedRole.details.duties"
                :key="i"
                >{{ duty }}</ProseLi
              >
            </ProseUl>
          </div>

          <div v-if="selectedRole?.details?.contactEmail">
            <ProseH4>Questions</ProseH4>
            <ProseP>
              Contact:
              <UButton
                :label="selectedRole.details.contactEmail"
                :to="`mailto:${selectedRole.details.contactEmail}`"
                variant="link"
                color="primary"
              />
            </ProseP>
          </div>
        </div>
      </template>

      <template #footer>
        <UButton
          label="Close"
          color="neutral"
          variant="ghost"
          @click="isDetailsOpen = false"
        />
        <UButton
          v-if="selectedRole?.available && selectedRole?.apply?.to"
          :label="selectedRole.apply.label ?? 'Apply'"
          :to="selectedRole.apply.to"
          :trailing-icon="
            selectedRole.apply.target === '_blank'
              ? 'i-lucide-external-link'
              : undefined
          "
          :target="selectedRole.apply.target"
          color="primary"
          variant="solid"
        />
      </template>
    </UModal>
  </div>
</template>
