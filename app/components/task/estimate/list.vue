<template>
  <ul class="flex flex-col gap-4">
    <li v-for="task in value" :key="task.idReadable">
      <NuxtLink
        :to="`/vote/${task.idReadable}`"
        class="p-2 flex items-center rounded gap-1"
        :class="{ 'bg-primary-100': route.params.room === task.idReadable }"
      >
        <Icon name="mdi:task-add" size="20" />

        {{ task.title }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script lang="ts" setup>
defineProps<{
  value: Task[]
}>()

const route = useRoute()
</script>
