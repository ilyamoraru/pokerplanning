import { useToken } from '~/composables'

export default defineNuxtPlugin(() => {
  const { getToken } = useToken()
  const UNAUTHORIZED_STATUS = 401

  const fetchInterceptor = $fetch.create({
    onRequest({ options }) {
      const token = getToken()

      if (token) {
        if (!options.headers) {
          options.headers = new Headers()
        }

        if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${token}`)
        } else {
          options.headers = {
            ...(options.headers as Record<string, string>),
            Authorization: `Bearer ${token}`
          } as any
        }
      }
    },

    async onResponseError({ response }) {
      if (response.status === UNAUTHORIZED_STATUS) {
        const { removeToken } = useToken()
        removeToken()

        // Сохраняем текущий путь для возврата после OAuth
        const currentPath = window.location.pathname + window.location.search

        // redirect передаётся через query и сохраняется на всех этапах OAuth flow
        await navigateTo(`/auth/?redirect=${encodeURIComponent(currentPath)}`)
      }
    }
  })

  return {
    provide: {
      api: fetchInterceptor
    }
  }
})
