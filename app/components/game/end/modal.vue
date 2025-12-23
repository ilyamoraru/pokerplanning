<template>
  <UModal
    :open="true"
    title="Завершение оценки"
    :close="{ color: 'primary', variant: 'outline' }"
    :dismissible="false"
    @update:open="emit('close')"
  >
    <template #body>
      <div class="p-6">
        <div class="flex flex-col gap-4">
          <UCheckbox v-model="isReference" label="Добавить задачу к эталонным" />
          <template v-if="sprints.length">
            <USelect
              v-model="selectedSprint"
              :items="sprints"
              :loading="sprintsLoading"
              placeholder="Выберите спринт"
              label-key="name"
              value-key="id"
            />
            <UButton
              class="justify-center"
              size="xl"
              :disabled="!selectedSprint"
              @click="emit('estimate', { sprintId: selectedSprint!, isReference })"
            >
              Отправить в спринт
            </UButton>
          </template>
          <template v-else> Не удалось загрузить спринты. Или их просто нет :( </template>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const props = defineProps<{
  taskId: Task['id']
}>()
const emit = defineEmits<{
  (e: 'estimate', value: { sprintId: Sprint['id']; isReference: boolean }): void
  (e: 'close'): void
}>()
const { sprints, sprintsLoading } = storeToRefs(useSprintStore())
const { getSprints } = useSprintStore()

const isReference = ref(false)
const selectedSprint = ref<Sprint['id']>()
onMounted(() => getSprints(props.taskId))
</script>
