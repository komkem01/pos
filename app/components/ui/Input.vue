<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-slate-700">{{ label }}</label>
    <div class="relative flex items-center">
      <span
        v-if="prefix"
        class="absolute left-3 select-none text-sm text-slate-400 pointer-events-none"
      >{{ prefix }}</span>
      <input
        v-model="display"
        :inputmode="inputMode"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full rounded-lg border text-sm outline-none transition',
          'focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
          error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white',
          disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'text-slate-800',
          prefix ? 'pl-7' : 'pl-3',
          suffix ? 'pr-8' : 'pr-3',
          align === 'right' ? 'text-right' : '',
          'py-2',
        ]"
        @focus="onFocus"
        @blur="onBlur"
      />
      <span
        v-if="suffix"
        class="absolute right-3 select-none text-sm text-slate-400 pointer-events-none"
      >{{ suffix }}</span>
    </div>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: number | string
    label?: string
    placeholder?: string
    /**
     * 'text'    = plain string input
     * 'decimal' = auto-formats to 2 decimal places on blur, emits number
     * 'integer' = whole number only, emits number
     */
    type?: 'text' | 'decimal' | 'integer'
    error?: string
    disabled?: boolean
    prefix?: string
    suffix?: string
    align?: 'left' | 'right'
  }>(),
  {
    type: 'text',
    placeholder: '',
    align: 'left',
  },
)

const emit = defineEmits<{
  'update:modelValue': [val: string | number]
}>()

const isFocused = ref(false)

function toDisplay(val: number | string | undefined): string {
  if (props.type === 'decimal') {
    const n = typeof val === 'number' ? val : parseFloat(String(val ?? ''))
    return isNaN(n) ? '' : n.toFixed(2)
  }
  return String(val ?? '')
}

// initialize ตั้งแต่ render ครั้งแรก ไม่ต้องรอ watch
const display = ref(toDisplay(props.modelValue))

watch(
  () => props.modelValue,
  (val) => {
    if (!isFocused.value) display.value = toDisplay(val)
  },
)

const inputMode = computed((): 'text' | 'decimal' | 'numeric' => {
  if (props.type === 'decimal') return 'decimal'
  if (props.type === 'integer') return 'numeric'
  return 'text'
})

function onFocus() {
  isFocused.value = true
  if (props.type === 'decimal' || props.type === 'integer') {
    const n = parseFloat(display.value)
    if (isNaN(n) || n === 0) {
      // ค่า 0 → ล้างออกให้พิมพ์ได้ทันที
      display.value = ''
    } else {
      // ค่าอื่น → ตัด trailing zeros ออก เช่น "50.00" → "50"
      display.value = String(n)
    }
  }
}

function onBlur() {
  isFocused.value = false
  if (props.type === 'decimal') {
    const n = parseFloat(display.value.replace(/,/g, ''))
    const result = !isNaN(n) && n >= 0 ? n : 0
    display.value = result.toFixed(2)
    emit('update:modelValue', result)
  } else if (props.type === 'integer') {
    const n = parseInt(display.value)
    const result = !isNaN(n) && n >= 0 ? n : 0
    display.value = String(result)
    emit('update:modelValue', result)
  } else {
    emit('update:modelValue', display.value)
  }
}
</script>
