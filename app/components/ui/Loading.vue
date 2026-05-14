<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"
        />
        <span v-if="text" class="text-sm font-medium text-white">{{ text }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    show?: boolean
    text?: string
  }>(),
  {
    show: false,
    text: '',
  },
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
