export const useSocket = () => {
  const { $socket } = useNuxtApp()
  const isConnected = ref(false)

  const onConnect = () => {
    setTimeout(() => {
      isConnected.value = true
    }, 1000)
  }
  const onDisconnect = () => {
    isConnected.value = false
  }

  const connectSocket = () => {
    if (import.meta.server) return

    if ($socket.connected) {
      onConnect()
    }

    $socket.on('connect', onConnect)
    $socket.on('disconnect', onDisconnect)
  }
  const disconnectSocket = () => {
    $socket.off('connect', onConnect)
    $socket.off('disconnect', onDisconnect)
  }

  return {
    isConnected,
    connectSocket,
    disconnectSocket
  }
}
