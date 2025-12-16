<template>
  <section class="min-h-[calc(100vh-var(--ui-header-height))]">
    <RoomField :users="roomUsers" />
  </section>
</template>

<script lang="ts" setup>
const props = defineProps<{
  user: User
  room: string
}>()

const { connectRoom, disconnectRoom, onUserConnect, onUserDisconnect, onUserPing } =
  useSocketUserConnect(props.room, props.user)
const roomUsers = ref<User[]>([props.user])

const getUserIndex = (user: User) => {
  return roomUsers.value.findIndex((item) => item.id === user.id)
}
const addUserInRoom = (user: User) => {
  const index = getUserIndex(user)
  console.log(index)
  if (index >= 1) return

  roomUsers.value.push(user)
}
const removeUserFromRoom = (user: User) => {
  if (user.id === props.user.id) return

  const index = getUserIndex(user)

  roomUsers.value.splice(index, 1)
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
