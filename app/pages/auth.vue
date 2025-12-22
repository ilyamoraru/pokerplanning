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
const { isPopup, notifySuccess, notifyError } = useOAuthPopup()
const { getOAuthUrl: getSavedOAuthUrl, clearOAuthUrl } = useOAuthUrl()

const loading = ref(false)
const error = ref<string | null>(null)

const inPopupMode = isPopup()

const handleLogin = async () => {
  // popup
  const width = 600
  const height = 700
  const left = window.screen.width / 2 - width / 2
  const top = window.screen.height / 2 - height / 2

  const popup = window.open(
    'about:blank',
    'oauth_popup',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
  )

  if (!popup) {
    error.value = 'Не удалось открыть popup окно. Проверьте настройки блокировки всплывающих окон.'
    return
  }

  loading.value = true
  error.value = null

  try {
    clearOAuthUrl()

    try {
      await fetchUser()
      popup.close()
      throw new Error('Пользователь уже авторизован')
    } catch {
      const oauthUrl = getSavedOAuthUrl()
      if (!oauthUrl) {
        popup.close()
        throw new Error('Не удалось получить OAuth URL')
      }
      popup.location.href = oauthUrl
    }

    const userData = await new Promise<User>((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          window.removeEventListener('message', handleMessage)
          reject(new Error('Окно авторизации было закрыто'))
        }
      }, 500)

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return
        }
        if (event.data.type === 'oauth_success') {
          window.removeEventListener('message', handleMessage)
          clearInterval(checkClosed)
          popup.close()
          resolve({
            token: event.data.token,
            name: event.data.name,
            id: event.data.id,
            avatar: event.data.avatar
          } as User)
        }
        if (event.data.type === 'oauth_error') {
          window.removeEventListener('message', handleMessage)
          clearInterval(checkClosed)
          popup.close()
          reject(new Error(event.data.error || 'Ошибка авторизации'))
        }
      }

      window.addEventListener('message', handleMessage)
    })

    const { token, id, avatar, name } = userData
    clearOAuthUrl()

    const { setToken } = useToken()
    const userStore = useUserStore()

    setToken(token)
    userStore.setUser({ id, avatar, name, token })

    const redirectUrl = (route.query.redirect as string) || '/'

    await router.push(redirectUrl)
  } catch (err) {
    // Закрываем popup при ошибке
    if (popup && !popup.closed) {
      popup.close()
    }
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

      // Очищаем OAuth URL после успешной авторизации
      clearOAuthUrl()

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
