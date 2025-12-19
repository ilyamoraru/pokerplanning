import type { Gamer, User } from '#shared/types/user'

export const UserToGamer = (user: User): Gamer => {
  return {
    id: user.id,
    name: user.id,
    avatar: user.avatar,
    card: undefined
  }
}
