export const useApi = () => {
  const {
    public: { apiBaseUrl }
  } = useRuntimeConfig()
  const { $api } = useNuxtApp()

  /**
   * получаем OAuth URL от API бэка
   * @return AsyncData<{ redirectUrl: string }>
   */
  const getOAuthUrl = async () => {
    return $api<{ redirectUrl: string }>('/auth/', { baseURL: apiBaseUrl })
  }

  /**
   * получаем пользователя по OAuth code
   * @param code - OAuth code от YouTrack
   * @return AsyncData<User> - { id, token, name, avatar }
   */
  const getUserByCode = async (code: string) => {
    return $api<User>(`/secured/user/${code}`, { baseURL: apiBaseUrl })
  }

  /**
   * получаем пользователя
   * @return Promise<User>
   */
  const fetchUser = () => {
    return $api<User>('/secured/user', { baseURL: apiBaseUrl })
  }

  /**
   * получаем список доступных к оценке тасок
   * @return Promise<Task>
   */
  const fetchAllTasksList = async () => {
    return $api<Task[]>('/secured/tasks', { baseURL: apiBaseUrl })
  }

  /**
   * получаем список референсных тасок
   * @return Promise<Task>
   */
  const fetchReferenceTasks = async () => {
    return $api<Task[]>('/secured/tasks/reference', { baseURL: apiBaseUrl })
  }

  /**
   * возвращаем в аналитику
   * @param taskId
   */
  const putTaskToAnalytics = async (taskId: Task['id']) => {
    return $api('/secured/tasks/return', {
      baseURL: apiBaseUrl,
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
    return $api('/secured/tasks/estimate', {
      method: 'PUT',
      body: {
        baseURL: apiBaseUrl,
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
    return $api<Sprint[]>('/secured/sprints', { baseURL: apiBaseUrl })
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
