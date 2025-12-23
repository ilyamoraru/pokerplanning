import { useAuth } from '~/composables'

export default defineNuxtRouteMiddleware(async (to) => {
  const { checkAndLoadUser } = useAuth()

  if (!(await checkAndLoadUser())) {
    return navigateTo(`/auth/?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
