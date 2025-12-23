import { useApi } from '~/composables'

export const useUserStore = defineStore('user', () => {
  const { fetchUser } = useApi()
  const { getToken, removeToken } = useToken()

  const user = ref<User | undefined>(undefined)
  const isAuthenticated = computed(() => !!user.value && !!getToken())

  const getUser = async () => {
    const userData = await fetchUser().catch((error) => {
      console.error('Error fetching user data ', error)
      // Если ошибка 401, очищаем пользователя и токен
      if (error?.statusCode === 401) {
        user.value = undefined
        removeToken()
      }
    })

    if (userData) {
      user.value = userData
    }
  }

  const setUser = (userData: User | undefined) => {
    user.value = userData
  }

  const logout = () => {
    user.value = undefined
    removeToken()
  }

  return {
    user,
    getUser,
    setUser,
    logout,
    isAuthenticated
  }
})
