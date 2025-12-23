<template>
  <UHeader>
    <template #left>
      <TaskSlideover v-if="sidebar" />
      <NuxtLink to="/" class="flex items-center gap-2">
        <Icon name="mdi:palette-swatch" size="20" />
        <UiTitle severity="h3" tag="h1">Poher Poker</UiTitle>
      </NuxtLink>
    </template>
    <template #right>
      <TaskReferenceModal class="mr-2" />
      <UserMenu />
      <UButton size="md" color="neutral" class="ml-auto" @click="handleLogout">
        <Icon name="mdi:logout" size="20" />
      </UButton>
    </template>
  </UHeader>
</template>

<script lang="ts" setup>
import { useAuth } from '~/composables'

const { logout } = useAuth()
withDefaults(
  defineProps<{
    sidebar?: boolean
  }>(),
  {
    sidebar: false
  }
)

const handleLogout = async() => await logout()
</script>
