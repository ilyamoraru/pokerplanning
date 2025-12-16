<template>
  <ClientOnly>
    <UMain>
      <UContainer
        v-if="!isConnected || !user"
        class="absolute size-full top-0 left-1/2 -translate-x-1/2 flex mx-auto flex-col justify-center"
      >
        <UiTitle severity="h2" class="text-center mb-2">Подключаемся к комнате...</UiTitle>
        <UProgress :model-value="null" />
      </UContainer>
      <Room v-else :user :room="route.params.room as string" />
    </UMain>
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'vote',
  middleware: ['task']
})
const { user } = storeToRefs(useUserStore())
const route = useRoute()

const { isConnected, connectSocket, disconnectSocket } = useSocket()

onMounted(() => {
  connectSocket()
})
onBeforeRouteLeave(() => {
  disconnectSocket()
})
</script>
