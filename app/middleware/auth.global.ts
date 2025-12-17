import { useToken } from '~/composables'

export default defineNuxtRouteMiddleware(async (to) => {
  const { hasToken } = useToken()
  const { getUser, isAuthenticated } = useUserStore()

  const publicPages = ['/auth']
  const isPublicPage = publicPages.includes(to.path)

  if (isPublicPage) {
    return
  }

  if (!hasToken()) {
    return navigateTo(`/auth?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (!isAuthenticated) {
    try {
      await getUser()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return navigateTo(`/auth?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  }
})
