export default defineNuxtRouteMiddleware(async () => {
  const { getTasksToEstimate } = useTaskStore()

  await getTasksToEstimate()
})
