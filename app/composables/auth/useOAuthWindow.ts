/**
 * @description Получение токена через popup окно
 * сгенерировано AI
 * каюсь
 */
export const useOAuthWindow = () => {
  /**
   * Открывает popup окно для OAuth авторизации
   * @param oauthUrl - URL для авторизации (от API бэка)
   * @returns Promise<{ token: string, name: string, id: string, avatar: string }> - разрешается после успешной авторизации
   */
  const openOAuthWindow = (oauthUrl: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      /**
       * открываем окно
       */
      const openWindow = () => {
        // Размеры popup окна
        const width = 600
        const height = 700
        const left = window.screen.width / 2 - width / 2
        const top = window.screen.height / 2 - height / 2

        return window.open(
          oauthUrl,
          'oauth_popup',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
        )
      }
      const closeWindow = (popup: Window) => {
        if (!popup.closed) {
          popup?.close()
        }
      }

      // Открываем popup
      const popup = openWindow()

      if (!popup) {
        reject(
          new Error(
            'Не удалось открыть popup окно. Проверьте настройки блокировки всплывающих окон.'
          )
        )
        return
      }

      /**
       * Проверяем, не закрыл ли пользователь popup вручную
       */
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          window.removeEventListener('message', handleMessage)
          reject(new Error('Окно авторизации было закрыто'))
        }
      }, 500)

      /**
       * удаляем слушатель событий и очищаем проверку ручного закрытия
       */
      const deleteListeners = () => {
        window.removeEventListener('message', handleMessage)
        clearInterval(checkClosed)
      }

      /**
       * возвращаем юзера при сообщение от окна о успешной авторизации
       * @param message
       */
      const getUserFromMessage = (message: MessageEvent<any>): User => {
        return {
          token: message.data.token,
          name: message.data.name,
          id: message.data.id,
          avatar: message.data.avatar
        }
      }

      /**
       *  Слушаем сообщения от popup
       */
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          console.warn('Ignored message from different origin:', event.origin)
          return
        }

        if (event.data.type === 'oauth_success') {
          deleteListeners()
          closeWindow(popup)
          resolve(getUserFromMessage(event))
        }

        if (event.data.type === 'oauth_error') {
          deleteListeners()
          closeWindow(popup)

          reject(new Error(event.data.error || 'Ошибка авторизации'))
        }
      }

      window.addEventListener('message', handleMessage)
    })
  }

  /**
   * Проверяет, открыта ли страница в popup окне
   */
  const isWindowOpened = () => {
    if (import.meta.server) return false
    return window.opener !== null
  }

  /**
   * Отправляет сообщение родительскому окну об успешной авторизации
   */
  const notifySuccess = (user: User) => {
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage(
          {
            type: 'oauth_success',
            token: user.token,
            name: user.name,
            id: user.id,
            avatar: user.avatar
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
    openOAuthWindow,
    isWindowOpened,
    notifySuccess,
    notifyError
  }
}
