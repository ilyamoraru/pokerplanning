<script lang="ts" setup>
import type {User} from "~/shared/types/user";
import {socket} from "~/components/socket";
import {type EndVoteMessage, SocketMessage} from "~/shared/types/message";

const props = defineProps<{
  room: string
  user: User
}>()

const endVote = () => {
  socket.emit(SocketMessage.endVote, ({
    room: props.room,
    user: props.user
  }) as EndVoteMessage);
}

const onEndVote = () => {
  socket.on('endGame', (data: EndVoteMessage) => {
    if (data.user.id === props.user.id) {
      //show end vote modal
    } else {
      //show loader
    }
  })
}
</script>
