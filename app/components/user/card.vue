<template>
  <UCard class="flex flex-col items-center max-w-[120px]">
    <UAvatar :src="value.avatar" class="mx-auto flex mt-2" />
    <p class="line-clamp-2 text-center" :title="value.name">{{ value.name }}</p>
  </UCard>
</template>

<script lang="ts" setup>
defineProps<{
  value: User
}>()
</script>
