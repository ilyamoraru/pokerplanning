<template>
  <UiTitle v-if="isNumericCard" severity="h4">
    {{ value.value }}
  </UiTitle>
  <Icon
    v-if="!isNumericCard"
    :name="cardStateMap[value.value as CardState].icon"
    :title="cardStateMap[value.value as CardState].title"
  />
</template>

<script setup lang="ts">
import { cardStateMap } from '#shared/utils/card'

const props = defineProps<{
  value: Card
}>()

const isNumericCard = computed(() => props.value.type === CardType.numeric)
</script>
