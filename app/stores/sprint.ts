export const useSprintStore = defineStore('sprint', () => {
  const { getSprintsList } = useApi()
  const sprints = ref<Sprint[]>([])

  const getSprints = async () => {
    try {
      if (sprints.value.length) return

      const sprintsData = await getSprintsList()

      if (sprintsData) {
        sprints.value = sprintsData
      }
    } catch (e) {
      console.error('FAILED TO LOAD SPRINTS ', e)
    }
  }

  return {
    sprints,
    getSprints
  }
})
