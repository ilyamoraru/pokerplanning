<script lang="ts" setup>
import { socket } from "./socket";
import type {User, UserMessage} from "~/shared/types/user";
import {type ConnectionMessage, SocketMessage} from "~/shared/types/message";

const props = defineProps<{
  room: string
  user: User
}>()

const message = computed((): ConnectionMessage => ({
  room: props.room,
  user: props.user,
  type: 'connect'
}))
//событие подключения к комнате
const onRoomConnect = () => {
  socket.emit(SocketMessage.connection, message.value)
}

//если зашел новый юзер и это не мы, отправляем всем себя
const onUserConnect = () => {
  socket.on(SocketMessage.connectUser, ({user}: UserMessage) => {
    if (user.id !== props.user.id) {
      socket.emit(SocketMessage.userPing, message.value);
    }
  })
}
// если юзер покинул игру
const onUserDisconnect = () => {
  socket.on(SocketMessage.disconnectUser, ({user}: UserMessage) => {
    //users.splice(user)
  })
}

//метод получения пользователя в команте, который не мы
const onUserPing = () => {
  socket.on(SocketMessage.userPing, ({user}: UserMessage) => {
    if (user.id !== props.user.id) {
      //users.push(user)
    }
  })
}
</script>
