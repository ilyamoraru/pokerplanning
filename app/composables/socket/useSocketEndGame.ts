export const useSocketEndGame = (room: string) => {
  const { $socket } = useNuxtApp()
  const router = useRouter()

  /**
   * инициируем конец игры
   */
  const endGame = () => {
    $socket.emit(SocketMessage.endGame, room as EndGameMessage)
    router.push('/')
  }

  /**
   * событие завершения игры
   */
  const onEndGame = () => {
    $socket.on(SocketMessage.endGame, () => {
      router.push('/')
    })
  }

  return {
    endGame,
    onEndGame
  }
}
