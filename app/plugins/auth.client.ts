import { useToken } from '~/composables'

export default defineNuxtPlugin(() => {
  const { getToken } = useToken()
  const UNAUTHORIZED_STATUS = 401

  // белый список при 401
  const getAllowedHosts = (): string[] => {
    const hosts = [window.location.host]

    const youtrackUrl = import.meta.env.VITE_YOUTRACK_OAUTH_URL
    if (youtrackUrl) {
      try {
        const url = new URL(youtrackUrl)
        hosts.push(url.host)
      } catch {
        console.warn('Invalid VITE_YOUTRACK_OAUTH_URL:', youtrackUrl)
      }
    }
    // добавляем дополнительные домены
    // hosts.push('hub.company.com')
    // hosts.push('auth.company.com')

    return hosts
  }

  // валидация перед редиректом
  const isUrlSafe = (urlString: string): boolean => {
    try {
      const url = new URL(urlString)
      const allowedHosts = getAllowedHosts()

      if (!['https:', 'http:'].includes(url.protocol)) {
        console.warn('Unsafe protocol in redirectUrl:', url.protocol)
        return false
      }

      if (!allowedHosts.includes(url.host)) {
        console.warn('Host not allowed for redirect:', url.host, 'Allowed:', allowedHosts)
        return false
      }

      return true
    } catch (e) {
      console.error('Invalid URL format:', urlString, e)
      return false
    }
  }

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
          } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }
      }
    },

    async onResponseError({ response }) {
      if (response.status === UNAUTHORIZED_STATUS) {
        const { removeToken } = useToken()
        removeToken()

        const data = response._data
        if (data?.redirectUrl) {
          if (isUrlSafe(data.redirectUrl)) {
            console.log('Redirecting to server-provided URL:', data.redirectUrl)

            // Сохраняем текущий путь для возврата после OAuth
            const currentPath = window.location.pathname + window.location.search
            const redirectParam = new URLSearchParams(window.location.search).get('redirect')
            const redirectAfterAuth = redirectParam || currentPath
            sessionStorage.setItem('auth_redirect_after_login', redirectAfterAuth)

            // Редиректим на OAuth URL от бэкенда
            window.location.href = data.redirectUrl
            return
          } else {
            console.error('Unsafe redirect URL rejected:', data.redirectUrl)
          }
        }

        // Fallback: локальная страница авторизации
        const currentPath = window.location.pathname
        await navigateTo(`/auth?redirect=${encodeURIComponent(currentPath)}`)
      }
    }
  })

  return {
    provide: {
      api: fetchInterceptor
    }
  }
})
