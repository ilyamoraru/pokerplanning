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
    } catch (error) {
      console.error('Auth middleware has error ', error)
      return navigateTo(`/auth/?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  }
})
