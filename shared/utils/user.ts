import type { Gamer, User } from '#shared/types/user'

export const UserToGamer = (user: User): Gamer => {
  return {
    ...user,
    card: undefined
  }
}

export const GamerToUser = (gamer: Gamer): User => {
  const user = { ...gamer }
  delete user.card

  return user
}
