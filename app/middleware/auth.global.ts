export default defineNuxtRouteMiddleware(async () => {
  const { getUser } = useUserStore()

  await getUser()
})
