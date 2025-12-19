/**
 * @description Получение токена через popup окно
 * сгенерировано AI
 * каюсь
 */
export const useOAuthPopup = () => {
  /**
   * Открывает popup окно для OAuth авторизации
   * @param oauthUrl - URL для авторизации (от API бэка)
   * @returns Promise<{ token: string, name: string, id: string, avatar: string }> - разрешается после успешной авторизации
   */
  const openOAuthPopup = (
    oauthUrl: string
  ): Promise<{ token: string; name: string; id: string; avatar: string }> => {
    return new Promise((resolve, reject) => {
      // Размеры popup окна
      const width = 600
      const height = 700
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      // Открываем popup
      const popup = window.open(
        oauthUrl,
        'oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
      )

      if (!popup) {
        reject(
          new Error(
            'Не удалось открыть popup окно. Проверьте настройки блокировки всплывающих окон.'
          )
        )
        return
      }

      // Проверяем, не закрыл ли пользователь popup вручную
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          window.removeEventListener('message', handleMessage)
          reject(new Error('Окно авторизации было закрыто'))
        }
      }, 500)

      // Слушаем сообщения от popup
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          console.warn('Ignored message from different origin:', event.origin)
          return
        }
        if (event.data.type === 'oauth_success') {
          window.removeEventListener('message', handleMessage)
          clearInterval(checkClosed)

          if (!popup.closed) {
            try {
              popup.close()
            } catch (err) {
              console.warn('Failed to close popup:', err)
            }
          }

          resolve({
            token: event.data.token,
            name: event.data.name,
            id: event.data.id,
            avatar: event.data.avatar
          })
        }

        if (event.data.type === 'oauth_error') {
          window.removeEventListener('message', handleMessage)
          clearInterval(checkClosed)

          if (!popup.closed) {
            try {
              popup.close()
            } catch (err) {
              console.warn('Failed to close popup:', err)
            }
          }

          reject(new Error(event.data.error || 'Ошибка авторизации'))
        }
      }

      window.addEventListener('message', handleMessage)
    })
  }

  /**
   * Проверяет, открыта ли страница в popup окне
   */
  const isPopup = () => {
    return window.opener !== null
  }

  /**
   * Отправляет сообщение родительскому окну об успешной авторизации
   */
  const notifySuccess = (token: string, user: User) => {
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage(
          {
            type: 'oauth_success',
            token,
            user
          },
          window.location.origin
        )
        console.log('OAuth success message sent to parent window')
      } catch (err) {
        console.error('Failed to send success message to parent:', err)
      }
    } else {
      console.warn('Parent window is not available')
    }
  }

  /**
   * Отправляет сообщение родительскому окну об ошибке
   */
  const notifyError = (error: string) => {
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage(
          {
            type: 'oauth_error',
            error
          },
          window.location.origin
        )
        console.log('OAuth error message sent to parent window')
      } catch (err) {
        console.error('Failed to send error message to parent:', err)
      }
    } else {
      console.warn('Parent window is not available')
    }
  }

  return {
    openOAuthPopup,
    isPopup,
    notifySuccess,
    notifyError
  }
}
