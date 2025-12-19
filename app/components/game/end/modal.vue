<template>
  <UModal :open="true" :close="false" :dismissible="false">
    <template #content>
      <div class="p-6">
        <UiTitle severity="h2" class="text-center">Завершение оценки</UiTitle>
        <div class="mt-10 flex flex-col gap-4">
          <UCheckbox v-model="isReference" label="Добавить задачу к эталонным" />
          <template v-if="sprints.length">
            <USelect
              v-model="selectedSprint"
              :items="sprints"
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
defineProps<{
  sprints: Sprint[]
}>()
const emit = defineEmits<{
  (e: 'estimate', value: { sprintId: Sprint['id']; isReference: boolean }): void
}>()

const isReference = ref(false)
const selectedSprint = ref<Sprint['id']>()
</script>
