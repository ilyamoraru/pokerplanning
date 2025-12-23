<template>
  <div v-if="user">
    <UUser :name="user.name" :avatar="{ src: user.avatar }" />
  </div>
</template>

<script lang="ts" setup>
const { user } = storeToRefs(useUserStore())
</script>
