import type {User, UserMessage} from "~/shared/types/user";
import {socket} from "~/utils/socket";
import {SocketMessage} from "~/shared/types/message";

export const useSocketUserConnect = (room: Ref<string>, user: Ref<User>) => {
  const message = computed(() => ({
    room: room.value,
    user: user.value,
    type: 'connect'
  }))

  /**
   *   событие подключения к комнате
   */
  const onRoomConnect = () => {
    socket.emit(SocketMessage.connection, message.value)
  }

  /**
   * если зашел новый юзер и это не мы, отправляем всем себя
   */
  const onUserConnect = () => {
    socket.on(SocketMessage.connectUser, ({user: userFromSocket}: UserMessage) => {
      if (userFromSocket.id !== user.value.id) {
        socket.emit(SocketMessage.userPing, message.value);
      }
    })
  }

  /**
   * отключаемся
   */
  const disconnect = () => {
    socket.emit(SocketMessage.connection, {
      ...message.value,
      type: 'disconnect'
    })
  }

  /**
   *   если юзер покинул игру
  */
  const onUserDisconnect = (handler: (user: User) => void) => {
    socket.on(SocketMessage.disconnectUser, ({user}: UserMessage) => {
      handler(user)
    })
  }

  /**
   *   метод получения пользователя в команте, который не мы
   */
  const onUserPing = (handler: (user: User) => void) => {
    socket.on(SocketMessage.userPing, ({user: userFromSocket}: UserMessage) => {
      if (userFromSocket.id !== user.value.id) {
        handler(userFromSocket)
      }
    })
  }

  return {
    onRoomConnect,
    onUserConnect,
    disconnect,
    onUserDisconnect,
    onUserPing
  }
}
