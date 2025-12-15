<template>
  <div>this is room page {{ params }}</div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'vote'
})

const { params } = useRoute()
</script>
