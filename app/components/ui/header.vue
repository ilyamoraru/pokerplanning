<template>
  <header
    class="bg-default/75 backdrop-blur border-b border-default h-(--ui-header-height) sticky top-0 z-50"
  >
    <div
      class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-full"
    >
      <div class="w-full flex justify-between">
        <div class="flex items-center gap-1.5">
          <TaskSlideover v-if="sidebar" />
          <NuxtLink to="/" class="flex items-center gap-2">
            <Icon name="mdi:palette-swatch" size="20" />
            <UiTitle severity="h3" tag="h1">Poher Poker</UiTitle>
          </NuxtLink>
        </div>
        <div v-if="!oauth">
          <div class="flex items-center gap-1.5">
            <TaskReferenceModal class="mr-2" />
            <UserMenu />
            <UButton
              size="md"
              color="neutral"
              variant="ghost"
              class="ml-auto"
              @click="handleLogout"
            >
              <Icon name="mdi:logout" size="20" />
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useAuth } from '~/composables'

const { logout } = useAuth()
withDefaults(
  defineProps<{
    sidebar?: boolean
    oauth?: boolean
  }>(),
  {
    sidebar: false
  }
)

const handleLogout = async () => await logout()
</script>
