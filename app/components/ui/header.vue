<template>
  <UHeader>
    <template #left>
      <TaskSlideover v-if="sidebar" />
      <NuxtLink to="/" class="flex items-center gap-2">
        <Icon name="mdi:account-card-outline" size="20" />
        <UiTitle severity="h3" tag="h1">Poher Poker</UiTitle>
      </NuxtLink>
    </template>
    <template #right>
      <TaskReferenceModal class="mr-2" />
      <UserMenu />
    </template>
  </UHeader>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    sidebar?: boolean
  }>(),
  {
    sidebar: false
  }
)
</script>
