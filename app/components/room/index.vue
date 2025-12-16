<template>
  <section class="min-h-[calc(100vh-var(--ui-header-height))]">
    <RoomGame :users="roomGamers" />
  </section>
</template>

<script lang="ts" setup>
const props = defineProps<{
  user: User
  room: string
}>()

const { connectRoom, disconnectRoom, onUserConnect, onUserDisconnect, onUserPing } =
  useSocketUserConnect(props.room, props.user)
const roomGamers = ref<Gamer[]>([UserToGamer(props.user)])

const getUserIndex = (user: User) => {
  return roomGamers.value.findIndex((item) => item.id === user.id)
}
const addUserInRoom = (user: User) => {
  const index = getUserIndex(user)

  if (index >= 1) return

  roomGamers.value.push(UserToGamer(user))
}
const removeUserFromRoom = (user: User) => {
  if (user.id === props.user.id) return

  const index = getUserIndex(user)

  roomGamers.value.splice(index, 1)
}

onMounted(() => {
  connectRoom()
  onUserConnect(addUserInRoom)
  onUserPing(addUserInRoom)
  onUserDisconnect(removeUserFromRoom)
})

window.onbeforeunload = () => {
  disconnectRoom()
}
onUnmounted(() => {
  disconnectRoom()
})
</script>
