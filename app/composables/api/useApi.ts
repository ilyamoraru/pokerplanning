export const useApi = () => {
  /**
   * получаем OAuth URL от API бэка
   * @return AsyncData<{ redirectUrl: string }>
   */
  const getOAuthUrl = async () => {
    return useFetch<{ redirectUrl: string }>('/api/auth/')
  }

  /**
   * получаем пользователя по OAuth code
   * @param code - OAuth code от YouTrack
   * @return AsyncData<User> - { id, token, name, avatar }
   */
  const getUserByCode = async (code: string) => {
    return useFetch<User>(`/api/secured/user/${code}`)
  }

  /**
   * получаем пользователя
   * @return Promise<User>
   */
  const fetchUser = () => {
    return useFetch<User>('/api/secured/user')
  }

  /**
   * получаем список доступных к оценке тасок
   * @return Promise<Task>
   */
  const fetchAllTasksList = async () => {
    return useFetch<Task[]>('/api/secured/tasks')
  }

  /**
   * получаем список референсных тасок
   * @return Promise<Task>
   */
  const fetchReferenceTasks = async () => {
    return useFetch<Task[]>('/api/secured/tasks/reference')
  }

  /**
   * возвращаем в аналитику
   * @param taskId
   */
  const putTaskToAnalytics = async (taskId: Task['id']) => {
    return useFetch('/api/secured/tasks/return', {
      method: 'PUT',
      body: {
        taskId
      }
    })
  }

  /**
   * оценка таски  спринт
   * @param taskId
   * @param sprintId
   * @param estimation
   * @param isReference
   */
  const estimateTask = async (
    taskId: Task['id'],
    sprintId: Sprint['id'],
    estimation: number,
    isReference?: boolean
  ) => {
    return useFetch('/api/secured/tasks/estimate', {
      method: 'PUT',
      body: {
        taskId,
        sprintId,
        estimation,
        isReference
      }
    })
  }

  /**
   * получаем список спринтов
   * @return Promise<Sprint>
   */
  const getSprintsList = async () => {
    return useFetch<Sprint[]>('/api/secured/sprints')
  }

  return {
    getOAuthUrl,
    getUserByCode,
    fetchUser,
    fetchAllTasksList,
    fetchReferenceTasks,
    getSprintsList,
    putTaskToAnalytics,
    estimateTask
  }
}
