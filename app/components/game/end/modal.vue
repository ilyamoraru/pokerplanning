<template>
  <UModal :open="true" :close="false" :dismissible="false">
    <template #content>
      <div class="p-6">
        <UiTitle severity="h2" class="text-center">Завершение оценки</UiTitle>
        <div class="mt-10 flex flex-col gap-4">
          <UCheckbox v-model="toReference" label="Добавить задачу к эталонным" />
          <UButton class="justify-center" size="xl" variant="outline">Отправить в беклог</UButton>
          <template v-if="sprints.length">
            <USeparator label="или" />
            <USelect
              v-model="selectedSprint"
              :items="sprints"
              placeholder="Выберите спринт"
              label-key="name"
              value-key="id"
            />
            <UButton class="justify-center" size="xl" :disabled="!selectedSprint"
              >Отправить в спринт</UButton
            >
          </template>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
defineProps<{
  sprints: Sprint[]
}>()

const toReference = ref(false)
const selectedSprint = ref<Sprint['id']>()
</script>
