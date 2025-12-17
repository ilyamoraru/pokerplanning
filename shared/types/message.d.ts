export type VoteMessage = {
  room: string
  gamer: Gamer
}

export type ResetVoteMessage = {
  room: string
}

//подключение
export type ConnectionMessage = {
  room: string
  gamer: Gamer
  type: 'connect' | 'disconnect'
}

// сообщение, что в игре
export type UserPingMessage = {
  room: string
  gamer: Gamer
}

export type EndVoteMessage = {
  room: string
  gamer: Gamer
}

export type EndGameMessage = string
