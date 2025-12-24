<template>
  <div class="flex items-center justify-center min-h-screen">
    <div v-if="loading" class="text-center">
      <div class="text-xl">Авторизация...</div>
      <div class="mt-2 text-gray-500">Пожалуйста, подождите</div>
    </div>
    <div v-else-if="user" class="text-center">
      <div class="text-2xl mb-4">
        Коллежа, <span class="text-gray-500">{{ user.name }}</span>, ты залогинен
      </div>
      <UButton class="px-6 py-3 transition" @click="navigateTo(`/`)"> Убегай к задачам </UButton>
    </div>
    <div v-else class="text-center">
      <div v-if="error" class="text-xl mb-4 text-red-500">{{ error }}</div>
      <div class="text-2xl mb-4">Требуется авторизация</div>
      <div class="text-gray-500 mb-6">Для продолжения работы необходимо авторизоваться</div>
      <UButton
        :loading="!oauthUrl"
        :disabled="!oauthUrl"
        class="px-6 py-3 transition"
        @click="handleLogin"
      >
        Авторизоваться через YouTrack
      </UButton>
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
const { openOAuthWindow } = useOAuthWindow()
const { clearOAuthUrl, oauthUrl } = useOAuthUrl()
const { setToken, getToken } = useToken()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { setUser, getUser } = userStore

const loading = ref(false)
const error = ref<string | null>(null)
const startAuth = () => {
  loading.value = true
  error.value = null
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

    console.warn('Failed to fetch user ', error)
    console.log('oauthUrl', oauthUrl.value)
    if (!oauthUrl.value) {
      throw new Error('Не удалось получить OAuth URL')
    }

    openOAuthWindow(oauthUrl.value)
      .then((res: User) => {
        console.log(res)
        const { token } = res
        setToken(token)
        setUser(res)
        clearOAuthUrl()
        redirectToRedirectUrl()
      })
      .catch((error) => {
        if (error.message.includes('Окно авторизации было закрыто')) {
          error.value = 'Вы закрыли окно авторизации. Нажмите кнопку еще раз для повторной попытки.'
          loading.value = false
          return
        }

        error.value = error.message || 'Не удалось выполнить авторизацию'
        loading.value = false
      })
  } catch (error: any) {
    throw new Error('Ошибка авторизации ', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await getUser()
  } catch (err) {
    console.error('Error fetching user:', err)
  } finally {
    loading.value = false
  }
})
</script>
