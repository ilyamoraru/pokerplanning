import { useToken, useOAuthUrl } from '~/composables'

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
        const { setOAuthUrl } = useOAuthUrl()

        removeToken()

        // Отладка: смотрим что приходит в ответе
        console.log('401 Response:', {
          _data: response._data,
          status: response.status,
          statusText: response.statusText
        })

        // Сохраняем redirectUrl из тела ответа
        const responseData = response._data as { redirectUrl?: string }
        if (responseData?.redirectUrl) {
          setOAuthUrl(responseData.redirectUrl)
        }

        // Если мы уже на странице /auth, не делаем редирект
        // (там мы намеренно получаем 401 для извлечения redirectUrl)
        const currentPathname = window.location.pathname
        if (currentPathname === '/auth') {
          return
        }

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
