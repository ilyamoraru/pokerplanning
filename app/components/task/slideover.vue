<template>
  <USlideover side="left" title="Задачи на оценку">
    <UButton color="neutral">
      <Icon name="mdi:playlist-edit" size="16" />
    </UButton>

    <template #body>
      <TaskEstimateList v-if="tasksToEstimate" :value="tasksToEstimate" />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
const { tasksToEstimate } = storeToRefs(useTaskStore())
</script>
