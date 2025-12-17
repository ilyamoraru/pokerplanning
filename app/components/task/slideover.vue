<template>
  <USlideover side="left" title="Задачи на оценку">
    <UButton color="neutral">
      <Icon name="mdi:playlist-edit" size="16" />
    </UButton>

    <template #body>
      <template v-if="tasksToEstimate">
        <header class="py-4 bg-white sticky -top-6 z-10">
          <UInput v-model="search" size="xl" placeholder="Поиск задачи" class="w-full">
            <template v-if="search.length" #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="mdi:close"
                @click="search = ''"
              />
            </template>
          </UInput>
        </header>
        <TaskEstimateList v-if="tasksToDisplay.length" :value="tasksToDisplay" />
        <UEmpty v-else variant="naked" title="Задачи не найдены" class="mt-1"></UEmpty>
      </template>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
const { tasksToEstimate } = storeToRefs(useTaskStore())

const search = ref('')
const tasksToDisplay = computed(() => {
  if (!search.value) return tasksToEstimate.value ?? []

  return (
    tasksToEstimate.value?.filter(
      (item) =>
        item.id.toLowerCase().includes(search.value.toLowerCase()) ||
        item.title.toLowerCase().includes(search.value.toLowerCase())
    ) ?? []
  )
})
</script>
