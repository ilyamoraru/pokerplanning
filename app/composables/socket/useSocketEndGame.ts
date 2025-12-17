export const useSocketEndGame = (room: string) => {
  const { $socket } = useNuxtApp()
  const router = useRouter()
  const { disconnectSocket } = useSocket()

  /**
   * инициируем конец игры
   */
  const endGame = () => {
    $socket.emit(SocketMessage.endVote, room)
  }

  /**
   * событие завершения игры
   */
  const onEndGame = () => {
    $socket.on(SocketMessage.endGame, () => {
      disconnectSocket()
      router.push('/')
    })
  }

  return {
    endGame,
    onEndGame
  }
}
