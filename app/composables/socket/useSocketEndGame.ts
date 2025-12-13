export const useSocketEndGame = (room: Ref<string>) => {
  const { disconnectSocket } = useSocket()
  const router = useRouter()

  /**
   * инициируем конец игры
   */
  const endGame = () => {
    socket.emit(SocketMessage.endVote, room.value)
  }

  /**
   * событие завершения игры
   */
  const onEndGame = () => {
    socket.on(SocketMessage.endGame, (data: EndVoteMessage) => {
      disconnectSocket()
      router.push('/')
    })
  }

  return {
    endGame,
    onEndGame
  }
}
