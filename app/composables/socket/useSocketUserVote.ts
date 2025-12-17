export const useSocketUserVote = (room: string) => {
  const { $socket } = useNuxtApp()

  /**
   * голосуем
   * @param gamer
   */
  const vote = (gamer: Gamer) => {
    $socket.emit(SocketMessage.vote, {
      gamer,
      room: room
    } as VoteMessage)
  }

  /**
   *  кто то проголосовал
   */
  const onUserVote = (handler: (message: VoteMessage) => void) => {
    $socket.on(SocketMessage.vote, (message: VoteMessage) => {
      handler(message)
    })
  }

  /**
   *  сбрасываем голосование
   */
  const resetVote = () => {
    $socket.emit(SocketMessage.resetVote)
  }

  /**
   *  сбросили голосование
   */
  const onResetVote = (handler: () => void) => {
    $socket.on(SocketMessage.resetVote, () => {
      handler()
    })
  }

  /**
   * метод запускает открытие модалки с завершение голосования
   */
  const endVote = (gamer: Gamer) => {
    $socket.emit(SocketMessage.endVote, {
      room,
      gamer
    } as EndVoteMessage)
  }

  /**
   * триггерится на событии завершения голосвания и открытия модалки
   * @param loaderHandler - метод для всех остальных
   */
  const onEndVote = (loaderHandler: () => void) => {
    $socket.on(SocketMessage.endVote, () => {
      loaderHandler()
    })
  }

  return {
    vote,
    onUserVote,
    resetVote,
    onResetVote,
    endVote,
    onEndVote
  }
}
