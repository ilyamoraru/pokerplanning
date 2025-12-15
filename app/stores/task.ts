export const useTaskStore = defineStore('task', () => {
  const { fetchReferenceTasks, fetchAllTasksList } = useApi()
  const referenceTasksList = ref<Task[] | undefined>(undefined)
  const loadingReferenceTasks = ref(false)
  const referenceTasks = computed(() => {
    if (!referenceTasksList.value) return

    return referenceTasksList.value.reduce(
      (acc, item) => {
        const { estimation } = item
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
  })

  const getReferenceTasks = async () => {
    if (referenceTasksList.value) return

    loadingReferenceTasks.value = true
    const { data } = await fetchReferenceTasks()

    if (data.value) {
      referenceTasksList.value = data.value
    }
    loadingReferenceTasks.value = false
  }

  //tasks to estimate
  const tasksToEstimate = ref<Task[] | undefined>(undefined)
  const getTasksToEstimate = async () => {
    const { data } = await fetchAllTasksList()

    if (data.value) {
      tasksToEstimate.value = data.value
    }
  }

  return {
    referenceTasksList,
    loadingReferenceTasks,
    getReferenceTasks,
    referenceTasks,
    getTasksToEstimate,
    tasksToEstimate
  }
})
