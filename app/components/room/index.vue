<template>
  <section class="min-h-[calc(100vh-var(--ui-header-height))]">
    <RoomGame
      v-model:game-is-done="gameIsDone"
      :gamers="roomGamers"
      :current-gamer="currentGamer"
      :room
      @vote="onCurrentGamerVote"
      @reveal-cards="onCurrentGamerRevealCards"
      @reset-game="onCurrentGamerResetGame"
    />
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
const { onUserVote, vote, revealCards, onRevealCards, resetVote, onResetVote } = useSocketUserVote(
  props.room
)
const currentGamer = ref<Gamer>({
  ...props.user,
  card: undefined
})
//другие игроки
const roomGamers = ref<Gamer[]>([])
//статус игры
const gameIsDone = ref(false)
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
/**
 * открыли карты
 */
const onCurrentGamerRevealCards = () => {
  gameIsDone.value = true
  revealCards()
}
/**
 * кто то открыл карты
 */
const onRevealCardsByAnotherGamer = () => {
  gameIsDone.value = true
}

const resetCards = () => {
  currentGamer.value!.card = undefined
  roomGamers.value.forEach((gamer: Gamer) => (gamer!.card = undefined))
}
const onCurrentGamerResetGame = () => {
  resetCards()
  resetVote()
}

const onResetGameByAnotherGamer = () => {
  gameIsDone.value = false
  resetCards()
}
// вешаем обработчики сообщений сокета
onMounted(() => {
  connectRoom(currentGamer.value)
  onUserConnect(currentGamer.value, addGamerInRoom)
  onUserPing(addGamerInRoom)
  onUserDisconnect(removeGamerFromRoom)
  onUserVote(onAnotherUserVote)
  onResetVote(onResetGameByAnotherGamer)
  onRevealCards(onRevealCardsByAnotherGamer)
})

window.onbeforeunload = () => {
  disconnectRoom(currentGamer.value)
}
onUnmounted(() => {
  disconnectRoom(currentGamer.value)
})
</script>
