import type { Sprint } from '#shared/types/sprint'

export const sprintMock: Sprint = {
  name: 'sprint ',
  dates: {
    start: '',
    finish: ''
  },
  id: '123'
}

export const sprintsListMock: Sprint[] = Array(10).fill({
  ...sprintMock,
  id: Math.random(),
  name: `${sprintMock.name}${Math.random()}`
})
