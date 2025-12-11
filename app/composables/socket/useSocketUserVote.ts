import type {User} from "~/shared/types/user";
import {type EndVoteMessage, SocketMessage, type VoteMessage} from "~/shared/types/message";
import {socket} from "~/utils/socket";
import type {Card} from "~/shared/types/card";

export const useSocketUserVote = (room: Ref<string>, user: Ref<User>) => {
  /**
   * голосуем
   * @param card
   */
  const vote = (card: Card) => {
    socket.emit(SocketMessage.vote, {
      user: user.value,
      room: room.value,
      card
    } as VoteMessage)
  }

  /**
   *  кто то проголосовал
   */
  const onUserVote = (handler: (message: VoteMessage) => void) => {
    socket.on(SocketMessage.vote, (message: VoteMessage) => {
      handler(message);
    })
  }

  /**
   *  сбрасываем голосование
   */
  const resetVote = () => {
    socket.emit(SocketMessage.resetVote, ({
      room: room.value,
    }))
  }

  /**
   *  сбросили голосование
   */
  const onResetVote = (handler: () => void) => {
    socket.on(SocketMessage.resetVote, () => {
      handler()
    })
  }

  /**
   * метод запускает открытие модалки с завершение голосования
   */
  const endVote = () => {
    socket.emit(SocketMessage.endVote, ({
      room: room.value,
      user: user.value
    }) as EndVoteMessage)
  }

  /**
   * триггерится на событии завершения голосвания и открытия модалки
   * @param endVoteHandler
   * @param loaderHandler - метод для всех остальных
   */
  const onEndVote = (endVoteHandler: () => void, loaderHandler: () => void) => {
    socket.on(SocketMessage.endVote, (data: EndVoteMessage) => {
      if (data.user.id === user.value.id) {
        endVoteHandler()
      } else {
        loaderHandler()
      }
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
