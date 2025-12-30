<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Color Mode Toggle - Bottom Right Corner -->
    <div class="fixed bottom-4 right-4 z-50">
      <UColorModeButton />
    </div>
  </UApp>
</template>
