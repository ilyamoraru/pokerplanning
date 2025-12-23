export const useSprintStore = defineStore('sprint', () => {
  const { getSprintsList } = useApi()
  const sprints = ref<Sprint[]>([])
  const sprintsLoading = ref<boolean>(false)

  const getSprints = async (taskId: Task['id']) => {
    try {
      sprintsLoading.value = true
      sprints.value = []
      const sprintsData = await getSprintsList(taskId)

      if (sprintsData) {
        sprints.value = sprintsData
      }
    } catch (e) {
      console.error('FAILED TO LOAD SPRINTS ', e)
    } finally {
      sprintsLoading.value = false
    }
  }

  return {
    sprints,
    sprintsLoading,
    getSprints
  }
})
