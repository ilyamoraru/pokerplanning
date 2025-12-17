import { useApi } from '~/composables'

export const useUserStore = defineStore('user', () => {
  const { fetchUser } = useApi()
  const { getToken, removeToken } = useToken()

  const user = ref<User | undefined>(undefined)

  const getUser = async () => {
    const { data, error } = await fetchUser()

    if (data.value) {
      user.value = data.value
    }

    // Если ошибка 401, очищаем пользователя и токен
    if (error.value?.statusCode === 401) {
      user.value = null
      removeToken()
    }
  }

  const setUser = (userData: User | null) => {
    user.value = userData
  }

  const logout = () => {
    user.value = null
    removeToken()
  }

  const isAuthenticated = computed(() => !!user.value && !!getToken())

  return {
    user,
    getUser,
    setUser,
    logout,
    isAuthenticated
  }
})
