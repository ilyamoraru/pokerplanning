export type User = {
  id: string
  name: string
  token: string
  image: string
  email: string
}

export type UserMessage = {
  user: User
}
