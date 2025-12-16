<template>
  <section>
    {{ roomUsers }}
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
const addUserInRoom = (user: User) => {
  roomUsers.value.push(user)
}
const removeUserFromRoom = (user: User) => {
  const { id } = user
  const index = roomUsers.value.findIndex((item) => item.id === id)

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
