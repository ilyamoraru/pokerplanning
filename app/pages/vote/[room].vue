<template>
  <ClientOnly>
    <UMain class="py-10">
      <UContainer
        v-if="!isConnected || !user || !roomTask"
        class="absolute size-full top-0 left-1/2 -translate-x-1/2 flex mx-auto flex-col justify-center"
      >
        <UiTitle severity="h2" class="text-center mb-2">Подключаемся к комнате...</UiTitle>
        <UProgress :model-value="null" />
      </UContainer>
      <Room
        v-else
        :user
        :task="roomTask"
        :sprints="sprints ?? []"
        :room="route.params.room as string"
      />
    </UMain>
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'vote',
  middleware: [
    'auth',
    'task',
    'sprint',
    (to) => {
      const { getRoomTask } = useTaskStore()
      getRoomTask(to.params.room as string)
    }
  ]
})
const { user } = storeToRefs(useUserStore())
const { roomTask } = storeToRefs(useTaskStore())
const { sprints } = storeToRefs(useSprintStore())
const route = useRoute()

const { isConnected, connectSocket, disconnectSocket } = useSocket()

onMounted(() => {
  connectSocket()
})
onBeforeRouteLeave(() => {
  disconnectSocket()
})
</script>
