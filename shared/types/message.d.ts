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
