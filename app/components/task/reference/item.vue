<template>
  <div class="relative">
    <div class="sticky -top-6 left-0 z-10 bg-white">
      <UiTitle severity="h3" class="">
        <Icon name="mdi:invoice-line-items-outline" size="16" class="mr-1" />
        {{ toPlural(estimation, 'Story point', 'Story points', 'Story points') }}
      </UiTitle>
      <USeparator class="my-2" />
    </div>

    <ul class="flex flex-col gap-2">
      <li v-for="task in tasks" :key="task.id">
        <TaskCard :value="task" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  estimation: number
  tasks: Task[]
}>()
</script>
