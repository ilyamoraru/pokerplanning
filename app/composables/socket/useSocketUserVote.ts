export const useSocketUserVote = (room: Ref<string>, user: Ref<User>) => {
  const { $socket } = useNuxtApp()

  /**
   * голосуем
   * @param card
   */
  const vote = (card: Card) => {
    $socket.emit(SocketMessage.vote, {
      user: user.value,
      room: room.value,
      card
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
  const endVote = () => {
    $socket.emit(SocketMessage.endVote, {
      room: room.value,
      user: user.value
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
