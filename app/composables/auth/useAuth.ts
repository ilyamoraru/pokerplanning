import { useToken } from './useToken'

export const useAuth = () => {
  const userStore = useUserStore()
  const { hasToken, removeToken, setToken } = useToken()
  const router = useRouter()

  const isAuthenticated = computed(() => userStore.isAuthenticated)

  const user = computed(() => userStore.user)

  /**
   * Выход из системы
   * @param redirectToAuth - Редиректить ли на страницу авторизации после выхода
   */
  const logout = async (redirectToAuth = true) => {
    userStore.logout()

    if (redirectToAuth) {
      await router.push('/auth')
    }
  }

  /**
   * Обработка OAuth callback (обмен code на токен и загрузка пользователя)
   * @param code - OAuth code из URL параметра
   */
  const handleAuthCallback = async (code: string): Promise<boolean> => {
    try {
      const { getUserByCode } = useApi()

      // Обмениваем code на userData с токеном
      const { data: userData, error } = await getUserByCode(code)

      if (error.value || !userData.value) {
        throw new Error(error.value?.message || 'Не удалось получить пользователя от API')
      }

      if (!userData.value.token) {
        throw new Error('Токен не получен от API')
      }

      setToken(userData.value.token)

      userStore.setUser(userData.value)

      return true
    } catch (error) {
      console.error('Ошибка при обработке auth callback:', error)
      removeToken()
      return false
    }
  }

  /**
   * Проверить и загрузить пользователя если есть токен
   * Используется в middleware для восстановления сессии
   */
  const checkAndLoadUser = async (): Promise<boolean> => {
    if (!hasToken()) {
      return false
    }

    if (userStore.user) {
      return true
    }

    try {
      await userStore.getUser()
      return !!userStore.user
    } catch (error) {
      console.error('Ошибка при загрузке пользователя:', error)
      return false
    }
  }

  return {
    isAuthenticated,
    user,
    logout,
    handleAuthCallback,
    checkAndLoadUser
  }
}
