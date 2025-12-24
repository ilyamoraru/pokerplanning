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

definePageMeta({
  layout: 'oauth'
})
const route = useRoute()
const router = useRouter()
const { fetchUser } = useApi()
const { openOAuthWindow } = useOAuthWindow()
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
  const redirect = route.query.code

  if (redirect) {
    router.push({
      query: { code: redirect as string }
    })
  } else {
    router.push('/')
  }
}

const handleLogin = async () => {
  try {
    startAuth()
    const userData = await fetchUser().catch((error) => {
      console.warn('Failed to fetch user ', error)
      const oauthUrl = getSavedOAuthUrl()
      if (!oauthUrl) {
        throw new Error('Не удалось получить OAuth URL')
      }

      openOAuthWindow(oauthUrl)
        .then((res: User) => {
          const { token } = res
          setToken(token)
          setUser(res)
          clearOAuthUrl()
          redirectToRedirectUrl()
        })
        .catch((error) => {
          throw new Error('Ошибка авторизации ', error)
        })
    })

    if (userData) {
      redirectToRedirectUrl()
    }
  } catch (error: any) {
    throw new Error('Ошибка авторизации ', error)
  } finally {
    loading.value = false
  }
}
</script>
