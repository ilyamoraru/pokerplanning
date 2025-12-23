import { useAuthInterceptors } from '~/composables/auth/useAuthInterceptors'

export default defineNuxtPlugin(() => {
  const { interceptors } = useAuthInterceptors()
  const {
    public: { apiBaseUrl }
  } = useRuntimeConfig()

  const fetch = $fetch.create({
    ...interceptors,
    baseURL: apiBaseUrl
  })

  return {
    provide: {
      fetch
    }
  }
})
