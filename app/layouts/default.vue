<script setup lang="ts"></script>
<template>
  <UContainer>
    <UHeader>
      <template #left>
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
    <UContainer>
      <slot />
    </UContainer>
  </UContainer>
</template>
