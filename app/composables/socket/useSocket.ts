export const useSocket = (onConnectionHandler?: () => void) => {
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

  if ($socket.connected) {
    onConnect()
  }

  const connectSocket = () => {
    if (import.meta.server) return
    $socket.on('connect', onConnect)
    $socket.on('disconnect', onDisconnect)
  }
  const disconnectSocket = () => {
    $socket.off('connect', onConnect)
    $socket.off('disconnect', onDisconnect)
  }

  watch(
    () => isConnected.value,
    (val) => {
      if (val && onConnectionHandler) {
        onConnectionHandler()
      }
    },
    {
      once: true
    }
  )

  return {
    isConnected,
    connectSocket,
    disconnectSocket
  }
}
