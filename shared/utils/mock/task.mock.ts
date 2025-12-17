import type { Task } from '#shared/types/task'

export const taskMock: Task = {
  id: '123123',
  idReadable: 'A-1488',
  title: 'task ',
  url: 'https://youtrack.intickets.ru/issue/A-1271/Izmeneniya-v-infre',
  description: '<p>description</p>',
  estimation: 1
}

export const tasksListMock: Task[] = Array(10)
  .fill(taskMock)
  .map((item, index) => {
    return {
      ...item,
      id: index.toString(),
      title: `${taskMock.title}${Math.random()}`,
      estimation: Math.round(Math.random() * 10)
    }
  })
