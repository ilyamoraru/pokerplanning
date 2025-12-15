<template>
  <ClientOnly>
    <UContainer
      v-if="!isConnected"
      class="absolute size-full top-0 left-0 flex flex-col justify-center"
    >
      <UiTitle severity="h2" class="text-center mb-2">Подключаемся к комнате...</UiTitle>
      <UProgress :model-value="null" />
    </UContainer>
    {{ isConnected }}
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'vote',
  middleware: ['task']
})
const { user } = storeToRefs(useUserStore())
const route = useRoute()

const { onRoomConnect } = useSocketUserConnect(route.params.room as string, user.value!)
const { isConnected, connectSocket, disconnectSocket } = useSocket(onRoomConnect)

onMounted(connectSocket)
onBeforeRouteLeave(disconnectSocket)
</script>
