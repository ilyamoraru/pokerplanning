<template>
  <div>this is room page {{ params }}</div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'vote',
  middleware: ['task']
})

const { params } = useRoute()
</script>
