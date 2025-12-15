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
        <div v-html="value.description" />
      </template>
    </UAccordion>
  </UCard>
</template>

<script lang="ts" setup>
defineProps<{
  value: Task
}>()
</script>
