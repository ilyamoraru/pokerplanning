export type User = {
  id: string
  name: string
  token: string
  avatar: string
}

export type Gamer = User & {
  card?: Card
}

export type UserMessage = {
  user: User
  room: string
}
