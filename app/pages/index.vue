<template>
  <main>
    <section class="py-10">
      <UiTitle severity="h1">Задачи для оценки</UiTitle>
      <TaskEstimateTable :value="tasksToEstimate" v-if="tasksToEstimate" />
    </section>
  </main>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['task']
})

const { tasksToEstimate } = storeToRefs(useTaskStore())
</script>
