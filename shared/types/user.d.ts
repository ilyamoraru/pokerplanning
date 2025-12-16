export type User = {
  id: string
  name: string
  token: string
  avatar: string
}

export type UserMessage = {
  user: User
  room: string
}
