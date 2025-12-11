import type {User} from "~/shared/types/user";
import type {Card} from "~/shared/types/card";

export enum SocketMessage {
  connection = 'connection',
  connectUser = 'connectUser',
  disconnectUser = 'disconnectUser',
  userPing = 'userPing',
  vote = 'vote',
  resetVote = 'resetVote',
  endVote = 'endVote',
  endGame = 'endGame'
}

export type VoteMessage = {
  room: string
  user: User
  card?: Card
}

export type ResetVoteMessage = {
  room: string
}

//подключение
export type ConnectionMessage = {
  room: string
  user: User
  type: 'connect' | 'disconnect'
}

// сообщение, что в игре
export type UserPingMessage = {
  room: string
  user: User
}

export type EndVoteMessage = {
  room: string
  user: User
}

export type EndGameMessage = string

