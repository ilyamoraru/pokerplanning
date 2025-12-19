export const useToken = () => {
  const authToken = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    sameSite: 'lax',
    path: '/'
  })

  const getToken = (): string | null => {
    return authToken.value
  }

  const setToken = (token: string) => {
    authToken.value = token
  }

  const removeToken = () => {
    authToken.value = null
  }

  const hasToken = (): boolean => {
    return !!authToken.value
  }

  return {
    getToken,
    setToken,
    removeToken,
    hasToken
  }
}
