<template>
  <div class="bg-primary-50 flex justify-center items-center">
    <UButton v-if="showEndGameButton" size="xl"> Открыть карты </UButton>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  gamers: Gamer[]
}>()

const showEndGameButton = computed(() => {
  const gamersWithVote = props.gamers.filter((item) => item.card)

  return gamersWithVote.length === props.gamers.length
})
</script>
