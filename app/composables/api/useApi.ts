export const useApi = () => {
  /**
   * получаем пользователя
   * @return Promise<User>
   */
  const getUser = () => {
    //GET /secured/user
  }

  /**
   * получаем список доступных к оценке тасок
   * @return Promise<Task>
   */
  const getAllTasksList = async () => {
    //GET /secured/tasks
    //: Promise<Task[]>
  }

  /**
   * получаем список референсных тасок
   * @return Promise<Task>
   */
  const getReferenceTasks = async () => {
    //GET /secured/tasks/reference
    //: Promise<Task[]>
  }

  /**
   * возвращаем в аналитику
   * @param task
   */
  const putTaskToAnalytics = async (taskId: Task['id']) => {
    //PUT /secured/tasks/return
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
    //PUT /secured/tasks/estimate
    // body: {taskId, sprintId, isReference}
  }

  /**
   * получаем список спринтов
   * @return Promise<Sprint>
   */
  const getSprintsList = async () => {
    //GET /secured/sprints
  }
}
