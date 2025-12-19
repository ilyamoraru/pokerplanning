<template>
  <section class="min-h-[calc(100vh-var(--ui-header-height))]">
    <Game
      v-model:game-is-done="gameIsDone"
      :task-name="task.title"
      :gamers="roomGamers"
      :current-gamer="currentGamer"
      @vote="onCurrentGamerVote"
      @reveal-cards="onCurrentGamerRevealCards"
      @reset-game="onCurrentGamerResetGame"
      @to-analytics="sendToAnalytics"
      @save-estimate="requestEndGame"
    />
    <GameEndModal
      v-if="gameIsEndingByUser"
      :sprints
      @estimate="estimate($event.sprintId, $event.isReference)"
    />
    <GameEndLoader v-else-if="gameIsEnding" class="bg-white fixed top-0 left-0 z-10 size-full" />
  </section>
</template>

<script lang="ts" setup>
import { useSocketUserVote } from '~/composables/socket/useSocketUserVote'
import { useSocketEndGame } from '~/composables'

const props = defineProps<{
  user: User
  sprints: Sprint[]
  task: Task
}>()

//ОБЩЕЕ СОСТОЯНИЕ ИГРЫ
const room = computed(() => props.task.idReadable)
const taskId = computed(() => props.task.id)
const { connectRoom, disconnectRoom, onUserConnect, onUserDisconnect, onUserPing } =
  useSocketUserConnect(room.value)
onMounted(() => {
  connectRoom(currentGamer.value)
  onUserConnect(currentGamer.value, addGamerInRoom)
  onUserPing(addGamerInRoom)
  onUserDisconnect(removeGamerFromRoom)
})
window.onbeforeunload = () => {
  disconnectRoom(currentGamer.value)
}
onUnmounted(() => {
  disconnectRoom(currentGamer.value)
})
const gameIsDone = ref(false)
const gameIsEndingByUser = ref(false)
const gameIsEnding = ref(false)
const resetGame = () => {
  gameIsDone.value = false
  gameIsEndingByUser.value = false
  gameIsEnding.value = false
}
//ИГРОК
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
const getGamerIndex = (user: Gamer) => {
  return roomGamers.value.findIndex((item) => item.id === user.id)
}
/**
 * добавление игрока
 * @param gamer
 */
const addGamerInRoom = (gamer: Gamer) => {
  const index = getGamerIndex(gamer)

  if (index >= 0) return
  resetGame()
  roomGamers.value.push(gamer)
}
/**
 * удаление игрока
 * @param user
 */
const removeGamerFromRoom = (user: Gamer) => {
  if (user.id === props.user.id) return

  const index = getGamerIndex(user)

  roomGamers.value.splice(index, 1)
}

//ГОЛОСОВАНИЕ
const { vote, onUserVote } = useSocketUserVote(room.value)

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

onMounted(() => {
  onUserVote(onAnotherUserVote)
})

//ОТКРЫТИЕ КАРТ
const { revealCards, onRevealCards } = useSocketUserVote(room.value)
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
onMounted(() => {
  onRevealCards(onRevealCardsByAnotherGamer)
})

//СБРОС КАРТ
const { resetVote, onResetVote } = useSocketUserVote(room.value)
/**
 * сбрасываем все карты у игроков
 */
const resetCards = () => {
  currentGamer.value!.card = undefined
  roomGamers.value.forEach((gamer: Gamer) => (gamer!.card = undefined))
}
/**
 * сбрасываем игру
 */
const onCurrentGamerResetGame = () => {
  resetCards()
  resetVote()
}

/**
 * кто то сбросил игру
 */
const onResetGameByAnotherGamer = () => {
  gameIsDone.value = false
  resetCards()
}
onMounted(() => {
  onResetVote(onResetGameByAnotherGamer)
})

//ЗАВЕРШЕНИЕ ИГРЫ
const { endVote, onEndVote } = useSocketUserVote(room.value)
const { endGame, onEndGame } = useSocketEndGame(room.value)
const { putTaskToAnalytics, estimateTask } = useApi()
const taskEstimation = ref<number>()

/**
 * вызывает событие завершения игры
 */
const requestEndGame = (estimation: number) => {
  endVote()
  taskEstimation.value = estimation
  gameIsEndingByUser.value = true
}
/**
 * кто то завершил игру
 */
const endGameByAnotherGamer = () => {
  gameIsEnding.value = true
}

/**
 * возврашаем таску в аналитику
 */
const sendToAnalytics = async () => {
  await putTaskToAnalytics(taskId.value)
  endGame()
}
/**
 * оценивание таски
 * @param sprintId
 * @param isReference
 */
const estimate = async (sprintId: Sprint['id'], isReference: boolean) => {
  await estimateTask(taskId.value, sprintId, taskEstimation.value ?? 0, isReference)
  endGame()
}
onMounted(() => {
  onEndVote(endGameByAnotherGamer)
  onEndGame()
})
</script>
