<template>
  <div class="flex items-center justify-center min-h-screen">
    <div v-if="loading" class="text-center">
      <div class="text-xl">Авторизация...</div>
      <div class="mt-2 text-gray-500">Пожалуйста, подождите</div>
    </div>
    <div v-else class="text-center">
      <div v-if="error" class="text-xl">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOAuthWindow } from '~/composables/auth/useOAuthWindow'

const route = useRoute()
const { handleAuthCallback } = useAuth()
const { isWindowOpened, notifySuccess, notifyError } = useOAuthWindow()

const loading = ref(false)
const error = ref<string | null>(null)

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

onMounted(() => setTimeout(onYouTrackAuthCallback))
</script>
