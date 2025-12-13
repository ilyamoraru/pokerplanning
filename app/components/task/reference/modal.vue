<template>
  <UModal close>
    <UButton color="neutral" class="cursor-pointer">
      <Icon name="mdi:star" size="16" title="Референсные задачи" />
    </UButton>

    <template #content>
      <TaskReferenceList
        v-if="!loadingReferenceTasks && referenceTasksList"
        :value="referenceTasksList"
      />
      <div v-else class="flex flex-col gap-4 p-4">
        <USkeleton v-for="item in 5" :key="item" class="h-12 w-full" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const { getReferenceTasks } = useTaskStore()
const { referenceTasksList, loadingReferenceTasks } = storeToRefs(useTaskStore())

onMounted(() => getReferenceTasks())
</script>
