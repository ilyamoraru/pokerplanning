<template>
  <UContainer>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2">
          <Icon name="mdi:account-card-outline" size="20" />
          <h1 class="text-xl">Poher Poker</h1>
        </NuxtLink>
      </template>
      <template #right>
        <TaskReferenceModal class="mr-2" />
        <UserMenu />
      </template>
    </UHeader>
    <slot />
  </UContainer>
</template>
