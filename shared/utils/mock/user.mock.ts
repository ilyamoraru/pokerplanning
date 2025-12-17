import type { User } from '#shared/types/user'

export const userMock = (): User => ({
  id: Math.random().toString(),
  name: 'User Userovich',
  token: '123123',
  avatar:
    'https://youtrack.intickets.ru/hub/api/rest/avatar/95a0080e-fe8e-49b4-b74c-dd09e390f4c0?etag=MjctODYw&dpr=1&size=32'
})
