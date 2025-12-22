<template>
  <div class="flex items-center justify-center min-h-screen">
    <div v-if="loading" class="text-center">
      <div class="text-xl">Авторизация...</div>
      <div class="mt-2 text-gray-500">Пожалуйста, подождите</div>
    </div>
    <div v-else class="text-center">
      <div v-if="error" class="text-xl">{{ error }}</div>
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
import { useOAuthWindow } from '~/composables/auth/useOAuthWindow'

const route = useRoute()
const router = useRouter()
const { handleAuthCallback } = useAuth()
const { fetchUser } = useApi()
const { isWindowOpened, notifySuccess, notifyError, openOAuthWindow } = useOAuthWindow()
const { getOAuthUrl: getSavedOAuthUrl, clearOAuthUrl } = useOAuthUrl()
const { setToken } = useToken()
const { setUser } = useUserStore()

const loading = ref(false)
const error = ref<string | null>(null)
const startAuth = () => {
  loading.value = true
  error.value = null
  clearOAuthUrl()
}

const redirectToRedirectUrl = () => {
  const redirectUrl = route.query.redirect ? (route.query.redirect as string) : '/'

  router.push(redirectUrl)
}

const handleLogin = async () => {
  try {
    startAuth()
    const { data, error } = await fetchUser()

    if (error) {
      console.warn('Failed to fetch user ', error)
      const oauthUrl = getSavedOAuthUrl()
      if (!oauthUrl) {
        throw new Error('Не удалось получить OAuth URL')
      }

      openOAuthWindow(oauthUrl)
        .then((res: User) => {
          const { token } = res
          clearOAuthUrl()
          setToken(token)
          setUser(res)
          redirectToRedirectUrl()
        })
        .catch((error) => {
          throw new Error('Ошибка авторизации ', error)
        })
    }

    if (data.value) {
      redirectToRedirectUrl()
    }
  } catch (error: any) {
    throw new Error('Ошибка авторизации ', error)
  } finally {
    loading.value = false
  }
}

const onYouTrackAuthCallback = async () => {
  const inPopupMode = isWindowOpened()
  const code = route.query.code as string
  if (!code) return

  loading.value = true

  try {
    const user = await handleAuthCallback(code)

    if (!user) {
      throw new Error('Не удалось авторизоваться')
    }
    if (inPopupMode) {
      notifySuccess(user)
      // Даём время на отправку сообщения, затем закрываем окно
      setTimeout(() => {
        window.close()
      }, 100)
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Ошибка при авторизации'

    if (inPopupMode) {
      notifyError(errorMessage)
      return
    }
  }
}

onMounted(onYouTrackAuthCallback)
</script>
