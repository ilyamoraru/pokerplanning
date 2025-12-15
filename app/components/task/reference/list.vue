<template>
  <ul class="flex flex-col gap-4">
    <li v-for="[estimation, tasks] in value" :key="estimation">
      <TaskReferenceItem :estimation :tasks />
    </li>
  </ul>
</template>

<script lang="ts" setup>
defineProps<{
  value: Map<number, Task[]>
}>()
</script>
