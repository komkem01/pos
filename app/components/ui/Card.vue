<template>
  <div :class="cardClass">
    <div v-if="title || $slots.header" class="mb-3 flex items-center justify-between">
      <h3 v-if="title" class="text-base font-semibold text-gray-800">{{ title }}</h3>
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" class="mt-3 border-t border-gray-100 pt-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    padding?: 'none' | 'sm' | 'md' | 'lg'
    shadow?: boolean
    border?: boolean
  }>(),
  {
    title: '',
    padding: 'md',
    shadow: true,
    border: true,
  },
)

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

const cardClass = computed(() => [
  'rounded-xl bg-white',
  paddingMap[props.padding],
  props.shadow && 'shadow-sm',
  props.border && 'border border-gray-200',
])
</script>
