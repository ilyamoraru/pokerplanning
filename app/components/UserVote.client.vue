<script lang="ts" setup>
import type {User} from "~/shared/types/user";
import {socket} from "~/components/socket";
import type {Card} from "~/shared/types/card";
import {SocketMessage, type VoteMessage} from "~/shared/types/message";

const props = defineProps<{
  room: string
  user: User
}>()

const card = ref<Card>()

//голосуем
const vote = () => {
  socket.emit(SocketMessage.vote, {
    user: props.user,
    room: props.room,
    card: card.value
  } as VoteMessage)
}

//кто то проголосовал
const onUserVote = () => {
  socket.on(SocketMessage.vote, (message: VoteMessage) => {
    //usersVotes.push(message)
  })
}

//сбрасываем голосование
const resetVote = () => {
  socket.emit(SocketMessage.resetVote, ({
    room: props.room,
  }))
}

//сбросили голосование
const onResetVote = () => {
  socket.on(SocketMessage.resetVote, () => {
    //users.reset()
  })
}
</script>
