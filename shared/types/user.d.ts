export type User = {
  id: string
  name: string
  token: string
  avatar: string
}

export type Gamer = User & {
  card?: Card
}

export type GamerMessage = {
  gamer: Gamer
  room: string
}
