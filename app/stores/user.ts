import { useApi } from '~/composables'

export const useUserStore = defineStore('user', () => {
  const { fetchUser } = useApi()

  const user = ref<User | undefined>(undefined)

  const getUser = async () => {
    const { data } = await fetchUser()

    if (data.value) {
      user.value = data.value
    }
  }

  return {
    user,
    getUser
  }
})
