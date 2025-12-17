<template>
  <UCard variant="outline" class="flex flex-col items-center max-w-[120px]">
    <UAvatar :src="value.avatar" class="mx-auto flex mt-2" />
    <p class="line-clamp-2 text-center" :title="value.name">{{ value.name }}</p>
    <div
      class="mt-2 flex transition justify-center items-center text-center rounded-full ring ring-default w-fit mx-auto p-2 min-w-10 min-h-10 size-10"
      :class="{ 'bg-primary-200': value.card || gameIsDone }"
    >
      <Icon v-if="!value.card || !gameIsDone" name="mdi:account-question-outline" size="20" />
      <CardValue v-else :value="value.card" class="bg-primary-200" />
    </div>
  </UCard>
</template>

<script lang="ts" setup>
defineProps<{
  value: Gamer
  gameIsDone: boolean
}>()
</script>
