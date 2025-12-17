export const useApi = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  /**
   * Обменять OAuth code на токен и данные пользователя
   * Этот запрос идет на ВНЕШНИЙ API (VITE_API_BASE_URL)
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
   * Получаем данные текущего пользователя
   * Запрос идет на ЛОКАЛЬНЫЙ API (/api/secured/user)
   * @return Promise<User>
   */
  const fetchUser = () => {
    return useFetch<User>('/api/secured/user')
  }

  /**
   * Получаем список доступных к оценке задач
   * Запрос идет на ЛОКАЛЬНЫЙ API (/api/secured/tasks)
   * @return Promise<Task[]>
   */
  const fetchAllTasksList = () => {
    return useFetch<Task[]>('/api/secured/tasks')
  }

  /**
   * Получаем список референсных задач
   * Запрос идет на ЛОКАЛЬНЫЙ API (/api/secured/tasks/reference)
   * @return Promise<Task[]>
   */
  const fetchReferenceTasks = () => {
    return useFetch<Task[]>('/api/secured/tasks/reference')
  }

  /**
   * Вернуть задачу в аналитику
   * Запрос идет на ЛОКАЛЬНЫЙ API
   * @param taskId - ID задачи
   */
  const putTaskToAnalytics = async (taskId: Task['id']) => {
    // PUT /api/secured/tasks/return
    // body: {taskId}
  }

  /**
   * Оценить задачу в текущий спринт
   * Запрос идет на ЛОКАЛЬНЫЙ API
   * @param taskId - ID задачи
   * @param sprintId - ID спринта
   * @param isReference - Является ли референсной
   */
  const estimateTask = async (
    taskId: Task['id'],
    sprintId: Sprint['id'],
    isReference?: boolean
  ) => {
    // PUT /api/secured/tasks/estimate
    // body: {taskId, sprintId, isReference}
  }

  /**
   * Получаем список спринтов
   * Запрос идет на ЛОКАЛЬНЫЙ API
   * @return Promise<Sprint[]>
   */
  const getSprintsList = async () => {
    // GET /api/secured/sprints
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
