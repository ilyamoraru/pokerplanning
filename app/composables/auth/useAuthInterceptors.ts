import type { FetchOptions, FetchResponse } from 'ofetch'

export const useAuthInterceptors = () => {
  const { getToken } = useToken()
  const UNAUTHORIZED_STATUS = 401

  const interceptors = {
    onRequest({ options }: { options: FetchOptions }) {
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
    async onResponseError({ response }: { response: FetchResponse<any> }) {
      if (response.status === UNAUTHORIZED_STATUS) {
        const { removeToken } = useToken()
        const { setOAuthUrl } = useOAuthUrl()
        removeToken()

        // Сохраняем redirectUrl из тела ответа
        const responseData = response._data as { redirectUrl?: string }

        if (responseData?.redirectUrl) {
          setOAuthUrl(responseData.redirectUrl)
        }

        // Если мы уже на странице /auth, не делаем редирект
        const currentPathname = window.location.pathname

        if (currentPathname.startsWith('/auth')) {
          return
        }

        // Сохраняем текущий путь для возврата после OAuth
        const currentPath = window.location.pathname + window.location.search

        // redirect передаётся через query и сохраняется на всех этапах OAuth flow
        await navigateTo(`/auth/?redirect=${encodeURIComponent(currentPath)}`)
      }
    }
  }

  return {
    interceptors
  }
}
