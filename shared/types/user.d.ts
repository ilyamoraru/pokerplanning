export type User = {
  id: string
  name: string
  token: string
  avatar: string
}

export type Gamer = Omit<User, 'token'> & {
  card?: Card
}

export type GamerMessage = {
  gamer: Gamer
  room: string
}
