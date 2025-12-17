<template>
  <section class="min-h-[calc(100vh-var(--ui-header-height))]">
    <RoomGame :gamers="roomGamers" :current-gamer="currentGamer" :room @vote="onCurrentGamerVote" />
  </section>
</template>

<script lang="ts" setup>
import { useSocketUserVote } from '~/composables/socket/useSocketUserVote'

const props = defineProps<{
  user: User
  room: string
}>()

const { connectRoom, disconnectRoom, onUserConnect, onUserDisconnect, onUserPing } =
  useSocketUserConnect(props.room)
const { onUserVote, vote } = useSocketUserVote(props.room)
const currentGamer = ref<Gamer>({
  ...props.user,
  card: undefined
})
//другие игроки
const roomGamers = ref<Gamer[]>([])

/**
 * получение индекса игрока
 * @param user
 */
const getGamerIndex = (user: User) => {
  return roomGamers.value.findIndex((item) => item.id === user.id)
}
/**
 * добавление игрока
 * @param gamer
 */
const addGamerInRoom = (gamer: Gamer) => {
  const index = getGamerIndex(gamer)

  if (index >= 0) return

  roomGamers.value.push(gamer)
}
/**
 * удаление игрока
 * @param user
 */
const removeGamerFromRoom = (user: User) => {
  if (user.id === props.user.id) return

  const index = getGamerIndex(user)

  roomGamers.value.splice(index, 1)
}
/**
 * событие голосования текущим игроком
 * @param card
 */
const onCurrentGamerVote = (card?: Card) => {
  currentGamer.value!.card = card
  vote(currentGamer.value)
}
/**
 * событие голосования другим игроком
 * @param message
 */
const onAnotherUserVote = (message: VoteMessage) => {
  const gamerToChange = getGamerIndex(message.gamer)
  if (gamerToChange < 0) return

  roomGamers.value[gamerToChange]!.card = message.gamer?.card
}
// вешаем обработчики сообщений сокета
onMounted(() => {
  connectRoom(currentGamer.value)
  onUserConnect(currentGamer.value, addGamerInRoom)
  onUserPing(addGamerInRoom)
  onUserDisconnect(removeGamerFromRoom)
  onUserVote(onAnotherUserVote)
})

window.onbeforeunload = () => {
  disconnectRoom(currentGamer.value)
}
onUnmounted(() => {
  disconnectRoom(currentGamer.value)
})
</script>
