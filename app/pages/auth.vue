<template>
  <div class="flex items-center justify-center min-h-screen">
    <div v-if="loading" class="text-center">
      <div class="text-xl">Авторизация...</div>
      <div class="mt-2 text-gray-500">Пожалуйста, подождите</div>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <div class="text-xl">{{ error }}</div>
      <button @click="router.push('/')" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        На главную
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { handleAuthCallback } = useAuth()
const { fetchUser } = useApi()

const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const code = route.query.code as string

    if (code) {
      const success = await handleAuthCallback(code)

      if (!success) {
        throw new Error('Не удалось авторизоваться')
      }
      const savedRedirect = sessionStorage.getItem('auth_redirect_after_login')
      const redirectUrl = savedRedirect || (route.query.redirect as string) || '/'

      sessionStorage.removeItem('auth_redirect_after_login')

      await router.push(redirectUrl)
    } else {
      await fetchUser()

      error.value = 'Не удалось получить OAuth URL от сервера'
      loading.value = false
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка при авторизации'
    loading.value = false
    console.error('Auth error:', err)
  }
})
</script>


