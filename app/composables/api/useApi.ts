import { useAuthInterceptors } from '~/composables/auth/useAuthInterceptors'

export const useApi = () => {
  const {
    public: { apiBaseUrl }
  } = useRuntimeConfig()
  const { interceptors } = useAuthInterceptors()

  /**
   * получаем пользователя по OAuth code
   * @param code - OAuth code от YouTrack
   * @return AsyncData<User> - { id, token, name, avatar }
   */
  const getUserByCode = async (code: string) => {
    return useFetch<User>(`/secured/user/${code}`, { baseURL: apiBaseUrl, ...interceptors })
  }

  /**
   * получаем пользователя
   * @return Promise<User>
   */
  const fetchUser = () => {
    return useFetch<User>('/secured/user', { baseURL: apiBaseUrl, ...interceptors })
  }

  /**
   * получаем список доступных к оценке тасок
   * @return Promise<Task>
   */
  const fetchAllTasksList = async () => {
    return useFetch<Task[]>('/secured/tasks', { baseURL: apiBaseUrl, ...interceptors })
  }

  /**
   * получаем список референсных тасок
   * @return Promise<Task>
   */
  const fetchReferenceTasks = async () => {
    return useFetch<Task[]>('/secured/tasks/reference', { baseURL: apiBaseUrl, ...interceptors })
  }

  /**
   * возвращаем в аналитику
   * @param taskId
   */
  const putTaskToAnalytics = async (taskId: Task['id']) => {
    return useFetch('/secured/tasks/return', {
      baseURL: apiBaseUrl,
      method: 'PUT',
      body: {
        taskId
      },
      ...interceptors
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
    return useFetch('/secured/tasks/estimate', {
      method: 'PUT',
      body: {
        baseURL: apiBaseUrl,
        taskId,
        sprintId,
        estimation,
        isReference
      },
      ...interceptors
    })
  }

  /**
   * получаем список спринтов
   * @return Promise<Sprint>
   */
  const getSprintsList = async () => {
    return useFetch<Sprint[]>('/secured/sprints', { baseURL: apiBaseUrl, ...interceptors })
  }

  return {
    getUserByCode,
    fetchUser,
    fetchAllTasksList,
    fetchReferenceTasks,
    getSprintsList,
    putTaskToAnalytics,
    estimateTask
  }
}
