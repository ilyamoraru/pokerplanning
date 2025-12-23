<template>
  <UModal
    title="Эталонные задачи"
    :close="{ color: 'primary', variant: 'outline' }"
    fullscreen
    @after:enter="getReferenceTasks()"
  >
    <UButton color="neutral" class="cursor-pointer">
      <Icon name="mdi:star" size="16" title="Референсные задачи" />
    </UButton>

    <template #body>
      <TaskReferenceList v-if="!loadingReferenceTasks && referenceTasks" :value="referenceTasks" />
      <div v-else class="flex flex-col gap-4 p-4">
        <USkeleton v-for="item in 5" :key="item" class="h-12 w-full" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const { getReferenceTasks } = useTaskStore()
const { referenceTasks, loadingReferenceTasks } = storeToRefs(useTaskStore())
</script>
