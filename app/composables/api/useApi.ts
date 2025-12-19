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
    getOAuthUrl,
    getUserByCode,
    fetchUser,
    fetchAllTasksList,
    fetchReferenceTasks,
    putTaskToAnalytics,
    estimateTask,
    getSprintsList
  }
}
