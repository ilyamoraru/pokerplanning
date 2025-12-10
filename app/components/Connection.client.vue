<template>
  <div>
    <p>Status: {{ isConnected ? "connected" : "disconnected" }}</p>
    <p>Transport: {{ transport }}</p>
    <UInput  v-model="text" />
    <UButton  @click="sendMessage">send</UButton>
    <UCard>
      {{messages}}

    </UCard>
  </div>
</template>

<script setup lang="ts">
import { socket } from "./socket";

const props = defineProps<{
  room: string
}>()

const isConnected = ref(false);
const transport = ref("N/A");

if (socket.connected) {
  onConnect();
}

function onConnect() {
  isConnected.value = true;
  transport.value = socket.io.engine.transport.name;

  socket.io.engine.on("upgrade", (rawTransport) => {
    transport.value = rawTransport.name;
    socket.emit('connect-room', props.room);
  });

}

function onDisconnect() {
  isConnected.value = false;
  transport.value = "N/A";
}

socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);

onBeforeUnmount(() => {
  socket.off("connect", onConnect);
  socket.off("disconnect", onDisconnect);
});

const text = ref('')
const sendMessage = () => {
  socket.emit('message', {
    room: props.room,
    type: '123',
    value: text.value,
    object: new Object({a: 1, b: 2}),
    array: new Array(3).fill(23)
  })
}
const messages = ref<any[]>([])
socket.on("message", (message) => messages.value.push(message))
</script>

