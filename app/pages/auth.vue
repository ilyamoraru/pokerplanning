<template>
  <div class="flex items-center justify-center min-h-screen">
    <div v-if="loading" class="text-center">
      <div class="text-xl">Авторизация...</div>
      <div class="mt-2 text-gray-500">Пожалуйста, подождите</div>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <div class="text-xl">{{ error }}</div>
      <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" @click="router.push('/')">
        На главную
      </button>
    </div>
    <div v-else class="text-center">
      <div class="text-2xl mb-4">Требуется авторизация</div>
      <div class="text-gray-500 mb-6">Для продолжения работы необходимо авторизоваться</div>
      <button
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        @click="handleLogin"
      >
        Авторизоваться через YouTrack
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { handleAuthCallback } = useAuth()
const { fetchUser } = useApi()
const { isPopup, notifySuccess, notifyError, openOAuthPopup } = useOAuthPopup()
const { getOAuthUrl: getSavedOAuthUrl, clearOAuthUrl } = useOAuthUrl()

const loading = ref(false)
const error = ref<string | null>(null)

const inPopupMode = isPopup()

const handleLogin = async () => {
  loading.value = true
  error.value = null

  try {
    let oauthUrl = getSavedOAuthUrl()

    // Если OAuth URL еще не сохранен, делаем запрос для получения 401 с redirectUrl
    if (!oauthUrl) {
      try {
        await fetchUser()
        // Если запрос успешен, значит пользователь уже авторизован
        throw new Error('Пользователь уже авторизован')
      } catch (err) {
        // Ожидаем 401, который сохранит redirectUrl в interceptor
        oauthUrl = getSavedOAuthUrl()
        if (!oauthUrl) {
          throw new Error('Не удалось получить OAuth URL')
        }
      }
    }

    // Открываем popup с OAuth URL
    const { token, id, avatar, name } = await openOAuthPopup(oauthUrl)

    clearOAuthUrl()

    const { setToken } = useToken()
    const userStore = useUserStore()

    setToken(token)
    userStore.setUser({ id, avatar, name, token })

    // redirect передаётся через query параметр
    const redirectUrl = (route.query.redirect as string) || '/'

    await router.push(redirectUrl)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка при авторизации'
    loading.value = false
    console.error('Auth error:', err)
  }
}

onMounted(async () => {
  const code = route.query.code as string

  if (code) {
    loading.value = true

    try {
      const success = await handleAuthCallback(code)

      if (!success) {
        throw new Error('Не удалось авторизоваться')
      }

      const userStore = useUserStore()
      const { getToken } = useToken()

      // Если мы в popup - отправляем данные родителю и закрываем окно
      if (inPopupMode) {
        const token = getToken()
        const user = userStore.user

        if (!token || !user) {
          throw new Error('Не удалось получить данные пользователя или токен')
        }

        notifySuccess(token, user)

        // Даём время на отправку сообщения, затем закрываем окно
        setTimeout(() => {
          window.close()
        }, 100)

        return
      }

      // redirect всегда передаётся через query параметр
      const redirectUrl = (route.query.redirect as string) || '/'

      await router.push(redirectUrl)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при авторизации'

      if (inPopupMode) {
        notifyError(errorMessage)
        return
      }

      error.value = errorMessage
      loading.value = false
      console.error('Auth error:', err)
    }
  }
})
</script>
