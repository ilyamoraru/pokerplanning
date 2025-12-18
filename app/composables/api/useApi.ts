export const useApi = () => {
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
    //PUT /secured/tasks/return
    // body: {taskId}
  }

  /**
   * оценка таски в текущий спринт
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
    //PUT /secured/tasks/estimate
    // body: {taskId, sprintId, isReference}
  }

  /**
   * получаем список спринтов
   * @return Promise<Sprint>
   */
  const getSprintsList = async () => {
    return useFetch<Sprint[]>('/api/secured/sprints')
  }

  return {
    fetchUser,
    fetchAllTasksList,
    fetchReferenceTasks,
    getSprintsList
  }
}
