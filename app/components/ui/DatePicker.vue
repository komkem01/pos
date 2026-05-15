<template>
  <div ref="containerRef" class="relative inline-block">
    <!-- Trigger button -->
    <button
      type="button"
      class="flex min-w-36 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition hover:border-blue-300 hover:bg-blue-50/40"
      :class="modelValue ? 'text-slate-700' : 'text-slate-400'"
      @click="toggle"
    >
      <Icon name="heroicons:calendar-days" class="h-4 w-4 shrink-0 text-slate-400" />
      <span class="flex-1 text-left">{{ displayValue }}</span>
      <Icon
        v-if="modelValue"
        name="heroicons:x-mark"
        class="h-3.5 w-3.5 shrink-0 text-slate-400 hover:text-slate-600"
        @click.stop="clear"
      />
    </button>

    <Teleport to="body">
      <!-- Backdrop -->
      <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />

      <!-- Calendar dropdown -->
      <div
        v-if="open"
        class="fixed z-50 mt-1 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
        :style="{ top: dropY + 'px', left: dropX + 'px' }"
      >
        <ClientOnly>
          <calendar-date :value="modelValue ?? ''" @change="onSelect">
            <svg
              slot="previous"
              aria-label="Previous"
              class="size-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <svg
              slot="next"
              aria-label="Next"
              class="size-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <calendar-month />
          </calendar-date>
        </ClientOnly>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fmt = useFormatter()
const containerRef = ref<HTMLElement | null>(null)
const open = ref(false)
const dropX = ref(0)
const dropY = ref(0)

const displayValue = computed(() =>
  props.modelValue ? fmt.date(props.modelValue) : (props.placeholder ?? 'เลือกวันที่'),
)

function toggle() {
  if (!open.value) {
    const rect = containerRef.value?.getBoundingClientRect()
    if (rect) {
      const CALENDAR_W = 284
      const PADDING = 8
      // Align left by default; flip to right-align if it would overflow
      const leftAligned = rect.left
      const rightAligned = rect.right - CALENDAR_W
      dropX.value = leftAligned + CALENDAR_W + PADDING > window.innerWidth
        ? Math.max(PADDING, rightAligned)
        : leftAligned
      // Align below by default; flip above if not enough room below
      const spaceBelow = window.innerHeight - rect.bottom
      dropY.value = spaceBelow < 320
        ? rect.top + window.scrollY - 320
        : rect.bottom + window.scrollY
    }
  }
  open.value = !open.value
}

function clear() {
  emit('update:modelValue', '')
}

function onSelect(e: Event) {
  const val = (e.target as HTMLElement & { value: string }).value
  if (val) {
    emit('update:modelValue', val)
    open.value = false
  }
}

onMounted(async () => {
  await import('cally')
})
</script>

<style>
calendar-date {
  --color-accent: #2563eb;
  --color-text-on-accent: #ffffff;
  font-family: inherit;
  font-size: 0.875rem;
  padding: 0.75rem;
  display: block;
  min-width: 260px;
}
</style>
