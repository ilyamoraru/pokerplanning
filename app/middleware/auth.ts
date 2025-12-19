import { useToken } from '~/composables'

export default defineNuxtRouteMiddleware(async (to) => {
  const { hasToken } = useToken()
  const { getUser, isAuthenticated } = useUserStore()

  if (!hasToken()) {
    return navigateTo(`/auth/?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (!isAuthenticated) {
    try {
      await getUser()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return navigateTo(`/auth/?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  }
})
