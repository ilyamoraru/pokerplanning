import {socket} from "~/utils/socket";

export const useSocket = () => {
  const isConnected = ref(false);
  const transport = ref("N/A");

  const onConnect = () => {
    isConnected.value = true;
    transport.value = socket.io.engine.transport.name;
  }
  const onDisconnect = () => {
    isConnected.value = false;
    transport.value = "N/A";
  }

  if (socket.connected) {
    onConnect();
  }

  const connectSocket = () => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
  }
  const disconnectSocket = () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
  }

  return {
    isConnected,
    connectSocket,
    disconnectSocket
  }
}
