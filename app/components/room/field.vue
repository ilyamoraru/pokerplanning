<template>
  <div class="bg-primary-50 flex justify-center items-center">
    <UButton v-if="!gameIsDone && showEndGameButton" size="xl" @click="emit('revealCards')">
      Открыть карты
    </UButton>
    <UButton v-else-if="showEndGameButton" size="xl" @click="emit('reset')"
      >Новое голосование</UButton
    >
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  gamers: Gamer[]
  gameIsDone: boolean
}>()
const emit = defineEmits(['revealCards', 'reset'])

const showEndGameButton = computed(() => {
  const gamersWithVote = props.gamers.filter((item) => item.card)

  return gamersWithVote.length === props.gamers.length
})
</script>
