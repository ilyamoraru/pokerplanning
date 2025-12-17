import { useToken } from './useToken'

export const useAuth = () => {
  const userStore = useUserStore()
  const { hasToken, removeToken, setToken } = useToken()
  const router = useRouter()
  const route = useRoute()

  const isAuthenticated = computed(() => userStore.isAuthenticated)

  const user = computed(() => userStore.user)

  /**
   * Получить OAuth URL для авторизации
   * @param redirectAfterAuth - URL для редиректа после успешной авторизации
   */
  const getOAuthUrl = (redirectAfterAuth?: string): string | null => {
    const youtrackOAuthUrl = import.meta.env.VITE_YOUTRACK_OAUTH_URL

    if (!youtrackOAuthUrl) {
      console.error('VITE_YOUTRACK_OAUTH_URL не настроен в .env')
      return null
    }

    // Определяем куда вернуться после авторизации
    const redirectPath = redirectAfterAuth || route.fullPath

    // Callback URL - наша страница /auth
    const callbackUrl = `${window.location.origin}/auth?redirect=${encodeURIComponent(redirectPath)}`

    // Формируем OAuth URL
    return `${youtrackOAuthUrl}?redirect_uri=${encodeURIComponent(callbackUrl)}`
  }

  /**
   * Инициировать процесс авторизации (редирект на OAuth)
   * @param redirectAfterAuth - URL для редиректа после успешной авторизации
   */
  const login = (redirectAfterAuth?: string) => {
    const oauthUrl = getOAuthUrl(redirectAfterAuth)

    if (oauthUrl) {
      window.location.href = oauthUrl
    } else {
      console.error('Не удалось получить OAuth URL')
    }
  }

  /**
   * Выход из системы
   * @param redirectToAuth - Редиректить ли на страницу авторизации после выхода
   */
  const logout = async (redirectToAuth = true) => {
    // Очищаем store и токен
    userStore.logout()

    if (redirectToAuth) {
      await router.push('/auth')
    }
  }

  const redirectToAuth = async () => {
    const currentPath = route.fullPath
    await router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`)
  }

  /**
   * Обработка OAuth callback (обмен code на токен и загрузка пользователя)
   * @param code - OAuth code из URL параметра
   */
  const handleAuthCallback = async (code: string): Promise<boolean> => {
    try {
      const { getUserByCode } = useApi()

      // Обмениваем code на userData с токеном
      const userData = await getUserByCode(code)

      // Проверяем что получили токен
      if (!userData.token) {
        throw new Error('Токен не получен от API')
      }

      // Сохраняем токен
      setToken(userData.token)

      // Сохраняем данные пользователя в store
      userStore.setUser(userData)

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
    // Если нет токена, пользователь не авторизован
    if (!hasToken()) {
      return false
    }

    // Если пользователь уже загружен, всё ок
    if (userStore.user) {
      return true
    }

    // Загружаем пользователя
    try {
      await userStore.getUser()
      return !!userStore.user
    } catch (error) {
      console.error('Ошибка при загрузке пользователя:', error)
      return false
    }
  }

  return {
    // Состояние
    isAuthenticated,
    user,

    // Методы авторизации
    login,
    logout,
    handleAuthCallback,

    // Утилиты
    redirectToAuth,
    getOAuthUrl,
    checkAndLoadUser
  }
}
