<template>
  <UCard>
    <a :href="value.url" target="_blank" class="flex items-start gap-1">
      <Icon name="mdi:link-variant" size="16" class="mt-1" />
      <UiTitle severity="h4">{{ value.title }}</UiTitle>
    </a>
    <USeparator class="my-1" />
    <UAccordion
      v-if="value?.description"
      :items="[{ label: 'Описание', content: value.description }]"
    >
      <template #body>
        <div class="task-description" v-html="value.description" />
      </template>
    </UAccordion>
  </UCard>
</template>

<script lang="ts" setup>
defineProps<{
  value: Task
}>()
</script>

<style scoped>
.task-description :deep(ul) {
  list-style: circle;
  padding: 40px;
}

.task-description :deep(ol) {
  list-style: decimal;
  padding: 40px;
}

.task-description :deep(a) {
  text-decoration: underline;
}
</style>
