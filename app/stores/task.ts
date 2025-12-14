export const useTaskStore = defineStore('task', () => {
  const { fetchReferenceTasks } = useApi()
  const referenceTasksList = ref<Task[] | undefined>(undefined)
  const loadingReferenceTasks = ref(false)

  const getReferenceTasks = async () => {
    loadingReferenceTasks.value = true
    const { data } = await fetchReferenceTasks()

    if (data.value) {
      referenceTasksList.value = data.value
    }
    loadingReferenceTasks.value = false
  }
  return {
    referenceTasksList,
    loadingReferenceTasks,
    getReferenceTasks
  }
})
