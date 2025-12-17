<template>
  <UContainer>
    <UiTitle severity="h3" class="text-center mb-4">Выберите карту:</UiTitle>
    <ul class="flex justify-center gap-4">
      <li v-for="card in desk" :key="card.value" class="w-full max-w-14">
        <CardItem :value="card" :gamer-vote class="h-full w-full" @vote="emit('vote', $event)" />
      </li>
    </ul>
  </UContainer>
</template>

<script lang="ts" setup>
defineProps<{
  gamerVote?: Card
}>()
const emit = defineEmits<{
  (e: 'vote', value?: Card): void
}>()

const fibonacciSequence = [0, 1, 2, 3, 5, 8, 13, 20]
const nonNumericCards: Card[] = [
  { type: CardType.state, value: CardState.watching },
  {
    type: CardType.state,
    value: CardState.coffee
  },
  {
    type: CardType.state,
    value: CardState.unclear
  }
]

const desk: Card[] = [
  ...fibonacciSequence.map((item) => ({ type: CardType.numeric, value: item })),
  ...nonNumericCards
]
</script>
