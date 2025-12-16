export const useSocketUserConnect = (room: string, user: User) => {
  const { $socket } = useNuxtApp()

  const message = computed(() => ({
    room,
    user,
    type: 'connect'
  }))

  /**
   *   событие подключения к комнате
   */
  const connectRoom = () => {
    $socket.emit(SocketMessage.connection, message.value)
  }

  /**
   * отключаемся
   */
  const disconnectRoom = () => {
    $socket.emit(SocketMessage.connection, {
      ...message.value,
      type: 'disconnect'
    })
  }

  /**
   *   если юзер покинул игру
   */
  const onUserDisconnect = (handler: (user: User) => void) => {
    $socket.on(SocketMessage.disconnectUser, ({ user }: UserMessage) => {
      handler(user)
    })
  }

  /**
   *   метод получения пользователя в команте, который не мы
   */
  const onUserConnect = (handler: (user: User) => void) => {
    $socket.on(SocketMessage.connectUser, ({ user: userFromSocket }: UserMessage) => {
      handler(userFromSocket)
      $socket.emit(SocketMessage.pingUser, { user: userFromSocket, room } as UserMessage)
    })
  }

  const onUserPing = (handler: (user: User) => void) => {
    $socket.on(SocketMessage.pingUser, ({ user }: UserMessage) => handler(user))
  }

  return {
    connectRoom,
    disconnectRoom,
    onUserDisconnect,
    onUserConnect,
    onUserPing
  }
}
