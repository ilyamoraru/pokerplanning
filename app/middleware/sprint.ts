export default defineNuxtRouteMiddleware(async () => {
  const { getSprints } = useSprintStore()

  await getSprints()
})
