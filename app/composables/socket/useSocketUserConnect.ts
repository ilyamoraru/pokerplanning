import type { GamerMessage } from '#shared/types/user'

export const useSocketUserConnect = (room: string) => {
  const { $socket } = useNuxtApp()

  const message = (currentGamer: Gamer): ConnectionMessage => ({
    room,
    gamer: currentGamer,
    type: 'connect'
  })

  /**
   *   событие подключения к комнате
   */
  const connectRoom = (currentGamer: Gamer) => {
    $socket.emit(SocketMessage.connection, message(currentGamer))
  }

  /**
   * отключаемся
   */
  const disconnectRoom = (currentGamer: Gamer) => {
    $socket.emit(SocketMessage.connection, {
      ...message(currentGamer),
      type: 'disconnect'
    })
  }

  /**
   *   если юзер покинул игру
   */
  const onUserDisconnect = (handler: (gamer: Gamer) => void) => {
    $socket.on(SocketMessage.disconnectUser, ({ gamer }: GamerMessage) => {
      handler(gamer)
    })
  }

  /**
   *   метод получения пользователя в команте, который не мы
   */
  const onUserConnect = (currentGamer: Gamer, handler: (gamer: Gamer) => void) => {
    $socket.on(SocketMessage.connectUser, ({ gamer }: GamerMessage) => {
      handler(gamer)
      $socket.emit(SocketMessage.pingUser, { gamer: currentGamer, room } as GamerMessage)
    })
  }

  const onUserPing = (handler: (gamer: Gamer) => void) => {
    $socket.on(SocketMessage.pingUser, ({ gamer }: GamerMessage) => handler(gamer))
  }

  return {
    connectRoom,
    disconnectRoom,
    onUserDisconnect,
    onUserConnect,
    onUserPing
  }
}
