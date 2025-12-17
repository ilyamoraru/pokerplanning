<template>
  <UiTitle v-if="value.type === CardType.numeric" severity="h4">
    {{ value.value }}
  </UiTitle>
  <Icon
    v-else
    :name="cardStateMap[value.value as CardState].icon"
    :title="cardStateMap[value.value as CardState].title"
  />
</template>

<script setup lang="ts">
import { cardStateMap } from '#shared/utils/card'

defineProps<{
  value: Card
}>()
</script>
