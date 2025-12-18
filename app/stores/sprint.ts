export const useSprintStore = defineStore('sprint', () => {
  const { getSprintsList } = useApi()
  const sprints = ref<Sprint[]>([])

  const getSprints = async () => {
    try {
      if (sprints.value.length) return

      const { data } = await getSprintsList()

      if (data.value) {
        sprints.value = data.value
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
