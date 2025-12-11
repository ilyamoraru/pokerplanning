<script lang="ts" setup>
import type {User} from "~/shared/types/user";
import {socket} from "~/components/socket";
import {type EndVoteMessage, SocketMessage} from "~/shared/types/message";

const props = defineProps<{
  room: string
}>()

const endGame = () => {
  socket.emit(SocketMessage.endVote, props.room)
}

const onEndGame = () => {
  socket.on('endGame', (data: EndVoteMessage) => {
    //leave page
    // socket.off('connect')
  })
}
</script>
