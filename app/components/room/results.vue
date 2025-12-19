<template>
  <UContainer class="flex flex-col items-center gap-4">
    <div class="text-center">
      <UiTitle severity="h5" class="mb-2">Среднее значение:</UiTitle>
      <UiTitle severity="h2">{{ average }}</UiTitle>
    </div>
    <div class="w-1/2 text-center">
      <UiTitle severity="h5" class="mb-2">Единодушие:</UiTitle>
      <UProgress :model-value="agreement" />
    </div>
    <div class="flex gap-2">
      <UButton size="xl" @click="emit('saveEstimate', average)"> Сохранить оценку </UButton>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const props = defineProps<{
  gamers: Gamer[]
}>()
const emit = defineEmits<{
  (e: 'saveEstimate', value: number): void
}>()

const { average, agreement } = useGameResults(props.gamers)
</script>
