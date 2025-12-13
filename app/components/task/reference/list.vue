<template>
  <section>
    {{ value }}
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  value: Task[]
}>()
</script>
