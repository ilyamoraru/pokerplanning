export const useToken = () => {
  const TOKEN_KEY = 'auth_token'

  const getToken = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  }

  const setToken = (token: string) => {
    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, token)
    }
  }

  const removeToken = () => {
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  const hasToken = (): boolean => {
    return !!getToken()
  }

  return {
    getToken,
    setToken,
    removeToken,
    hasToken
  }
}
