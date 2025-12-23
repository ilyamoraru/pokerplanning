export const useApi = () => {
  const { $fetch } = useNuxtApp()

  /**
   * получаем пользователя по OAuth code
   * @param code - OAuth code от YouTrack
   * @return AsyncData<User> - { id, token, name, avatar }
   */
  const getUserByCode = async (code: string) => {
    return $fetch<User>(`/users/${code}`)
  }

  /**
   * получаем пользователя
   * @return Promise<User>
   */
  const fetchUser = () => {
    return $fetch<User>('/secured/user')
  }

  /**
   * получаем список доступных к оценке тасок
   * @return Promise<Task>
   */
  const fetchAllTasksList = async () => {
    return $fetch<Task[]>('/secured/tasks')
  }

  /**
   * получаем список референсных тасок
   * @return Promise<Task>
   */
  const fetchReferenceTasks = async () => {
    return $fetch<Task[]>('/secured/tasks/reference')
  }

  /**
   * возвращаем в аналитику
   * @param taskId
   */
  const putTaskToAnalytics = async (taskId: Task['id']) => {
    return $fetch('/secured/tasks/return', {
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
    return $fetch('/secured/tasks/estimate', {
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
    return $fetch<Sprint[]>('/secured/sprints')
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
