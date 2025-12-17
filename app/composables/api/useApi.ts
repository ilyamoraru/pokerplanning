export const useApi = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  /**
   * запрос идет на ВНЕШНИЙ API (VITE_API_BASE_URL)
   * @param code - OAuth code из YouTrack redirect
   * @return Promise<User> - { id, token, name, avatar }
   */
  const getUserByCode = async (code: string): Promise<User> => {
    if (!apiBaseUrl) {
      throw new Error('VITE_API_BASE_URL не настроен в .env')
    }

    const response = await $fetch<User>(`${apiBaseUrl}/users/${code}`, {
      method: 'GET'
    })

    return response
  }

  /**
   * получаем пользователя
   * @return Promise<User>
   */
  const fetchUser = async () => {
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
   * @param task
   */
  const putTaskToAnalytics = async (taskId: Task['id']) => {
    // PUT /secured/tasks/return
    // body: {taskId}
  }

  /**
   * оценка таски в текущий спринт
   * @param task
   */
  const estimateTask = async (
    taskId: Task['id'],
    sprintId: Sprint['id'],
    isReference?: boolean
  ) => {
    // PUT /secured/tasks/estimate
    // body: {taskId, sprintId, isReference}
  }

  /**
   * получаем список спринтов
   * @return Promise<Sprint>
   */
  const getSprintsList = async () => {
    // GET /secured/sprints
  }

  return {
    getUserByCode,
    fetchUser,
    fetchAllTasksList,
    fetchReferenceTasks,
    putTaskToAnalytics,
    estimateTask,
    getSprintsList
  }
}
