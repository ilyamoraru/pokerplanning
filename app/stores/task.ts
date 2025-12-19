import { id } from '@nuxt/ui/locale'

export const useTaskStore = defineStore('task', () => {
  const { fetchReferenceTasks, fetchAllTasksList } = useApi()
  const referenceTasksList = ref<Task[] | undefined>(undefined)
  const loadingReferenceTasks = ref(false)
  const referenceTasks = computed(() => {
    if (!referenceTasksList.value) return

    const tasks = referenceTasksList.value.reduce(
      (acc, item) => {
        const { estimation } = item

        if (!estimation) return acc
        if (!acc.has(estimation)) {
          acc.set(estimation, [])
        }

        let tasks = acc.get(estimation)!
        tasks = [...tasks, item]

        acc.set(estimation, tasks)

        return acc
      },
      new Map() as Map<number, Task[]>
    )

    return new Map([...tasks.entries()].sort(([aNumber], [bNumber]) => aNumber - bNumber))
  })

  const getReferenceTasks = async () => {
    try {
      if (referenceTasksList.value) return

      loadingReferenceTasks.value = true
      const { data } = await fetchReferenceTasks()

      if (data.value) {
        referenceTasksList.value = data.value
      }
    } catch (error) {
      console.error('FAILED TO LOAD REFERENCE TASKS ', error)
      referenceTasksList.value = []
    } finally {
      loadingReferenceTasks.value = false
    }
  }

  //tasks to estimate
  const tasksToEstimate = ref<Task[] | undefined>(undefined)
  const getTasksToEstimate = async () => {
    try {
      const { data } = await fetchAllTasksList()

      if (data.value) {
        tasksToEstimate.value = data.value
      }
    } catch (error) {
      console.error('FAILED TO LOAD TASKS ', error)
    }
  }
  const roomTask = ref<Task>()
  const getRoomTask = (idReadable: Task['idReadable']) => {
    if (!tasksToEstimate.value)
      throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })

    const task = tasksToEstimate.value.find((task) => task.idReadable === idReadable)

    if (task) {
      roomTask.value = task
    } else {
      if (import.meta.server) {
        throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
      }
      if (import.meta.client) {
        return useRouter().push('/404')
      }
    }
  }

  return {
    referenceTasksList,
    loadingReferenceTasks,
    getReferenceTasks,
    referenceTasks,
    getTasksToEstimate,
    tasksToEstimate,
    roomTask,
    getRoomTask
  }
})
