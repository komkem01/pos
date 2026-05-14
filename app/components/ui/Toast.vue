<template>
  <Teleport to="body">
    <div class="fixed right-4 top-4 z-[100] flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="toastClass(toast.type)"
          class="flex w-80 items-start gap-3 rounded-xl px-4 py-3 shadow-lg"
        >
          <Icon :name="iconMap[toast.type]" class="mt-0.5 h-5 w-5 shrink-0" />
          <div class="flex-1">
            <p v-if="toast.title" class="text-sm font-semibold">{{ toast.title }}</p>
            <p class="text-sm">{{ toast.message }}</p>
          </div>
          <button class="shrink-0 opacity-60 hover:opacity-100" @click="remove(toast.id)">
            <Icon name="heroicons:x-mark" class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, remove } = useToast()

type ToastType = 'success' | 'error' | 'warning' | 'info'

const iconMap: Record<ToastType, string> = {
  success: 'heroicons:check-circle',
  error: 'heroicons:x-circle',
  warning: 'heroicons:exclamation-triangle',
  info: 'heroicons:information-circle',
}

const typeClass: Record<ToastType, string> = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-400 text-gray-900',
  info: 'bg-blue-500 text-white',
}

function toastClass(type: ToastType) {
  return typeClass[type]
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
