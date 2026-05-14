<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="$emit('cancel')"
      >
        <div class="w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl">
          <!-- Icon -->
          <div class="mb-4 flex justify-center">
            <div :class="`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`">
              <Icon :name="icon" :class="`h-6 w-6 ${iconColor}`" />
            </div>
          </div>

          <!-- Text -->
          <h3 class="mb-1 text-center text-base font-bold text-slate-800">{{ title }}</h3>
          <p v-if="description" class="mb-5 text-center text-sm text-slate-500">{{ description }}</p>
          <div v-else class="mb-5" />

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              class="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition active:scale-95"
              @click="$emit('cancel')"
            >
              {{ cancelLabel }}
            </button>
            <button
              :class="`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition active:scale-95 ${confirmClass}`"
              @click="$emit('confirm')"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    show: boolean
    title: string
    description?: string
    icon?: string
    variant?: 'danger' | 'warning' | 'info'
    confirmLabel?: string
    cancelLabel?: string
  }>(),
  {
    description: '',
    icon: 'heroicons:exclamation-triangle',
    variant: 'danger',
    confirmLabel: 'ยืนยัน',
    cancelLabel: 'ยกเลิก',
  },
)

defineEmits<{ confirm: []; cancel: [] }>()

const iconBg = computed(() => ({
  danger: 'bg-red-100',
  warning: 'bg-yellow-100',
  info: 'bg-blue-100',
}[props.variant ?? 'danger']))

const iconColor = computed(() => ({
  danger: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}[props.variant ?? 'danger']))

const confirmClass = computed(() => ({
  danger: 'bg-red-500 hover:bg-red-600',
  warning: 'bg-yellow-500 hover:bg-yellow-600',
  info: 'bg-blue-600 hover:bg-blue-700',
}[props.variant ?? 'danger']))
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
