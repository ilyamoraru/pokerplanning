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
  userVote?: Card
}>()
const emit = defineEmits<{
  (e: 'vote', value?: Card): void
}>()
const cardIsActive = computed(
  () => props.userVote?.type === props.value.type && props.userVote?.value === props.value.value
)
</script>
