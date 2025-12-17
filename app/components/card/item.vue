<template>
  <UCard
    class="text-black h-full transition"
    :ui="{ body: '!p-0 h-full w-full' }"
    :class="{ '-translate-y-4': cardIsActive }"
  >
    <template #default>
      <UButton
        :variant="cardIsActive ? 'solid' : 'outline'"
        class="py-8 px-4 h-full w-full flex justify-center items-center"
        @click="emit('vote', cardIsActive ? undefined : value)"
      >
        <CardValue :value />
      </UButton>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
  value: Card
  gamerVote?: Card
}>()
const emit = defineEmits<{
  (e: 'vote', value?: Card): void
}>()
const cardIsActive = computed(
  () => props.gamerVote?.type === props.value.type && props.gamerVote?.value === props.value.value
)
</script>
