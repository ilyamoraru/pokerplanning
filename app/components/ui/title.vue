<template>
  <Component :is="tag || severity" :class="computedClasses">
    <slot />
  </Component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

type PropType = {
  severity?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const props = withDefaults(defineProps<PropType>(), {
  severity: 'h1',
  size: 'default',
  tag: undefined
})

const classesSeverityMap: Record<NonNullable<PropType['severity']>, string> = {
  h1: 'text-3xl font-medium  leading-[120%]',
  h2: 'text-2xl font-semibold leading-7',
  h3: 'text-xl font-semibold leading-[120%]',
  h4: 'text-lg font-medium leading-[22px]',
  h5: 'text-base font-medium leading-5',
  h6: 'text-sm font-medium leading-5'
}

const computedClasses = computed(() => [classesSeverityMap[props.severity]])
</script>
