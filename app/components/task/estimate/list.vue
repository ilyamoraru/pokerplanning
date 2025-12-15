<template>
  <div>
    <UInput v-model="search" size="xl" placeholder="Поиск задачи" class="w-full">
      <template v-if="search.length" #trailing>
        <UButton color="neutral" variant="link" size="sm" icon="mdi:close" @click="search = ''" />
      </template>
    </UInput>
    <ul v-if="tasksToDisplay.length" class="flex flex-col gap-4">
      <li v-for="task in tasksToDisplay" :key="task.id">
        <NuxtLink
          :to="`/vote/${task.id}`"
          class="p-2 flex items-center rounded gap-1"
          :class="{ 'bg-primary-100': route.params.room === task.id }"
        >
          <Icon name="mdi:task-add" size="20" />

          {{ task.title }}
        </NuxtLink>
      </li>
    </ul>
    <UEmpty v-else variant="naked" title="Задачи не найдены" class="mt-1"></UEmpty>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  value: Task[]
}>()

const route = useRoute()
const search = ref('')

const tasksToDisplay = computed(() => {
  if (!search.value) return props.value

  return props.value.filter(
    (item) =>
      item.id.toLowerCase().includes(search.value.toLowerCase()) ||
      item.title.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>
