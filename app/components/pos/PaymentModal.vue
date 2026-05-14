<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="$emit('close')"
      >
        <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h2 class="mb-4 text-lg font-bold text-slate-800">ชำระเงิน</h2>

          <!-- Total -->
          <div class="mb-5 rounded-xl bg-blue-50 p-4 text-center">
            <p class="text-sm text-slate-500">ยอดที่ต้องชำระ</p>
            <p class="mt-1 text-3xl font-bold text-blue-600">{{ fmt.currency(total) }}</p>
          </div>

          <!-- Payment method -->
          <p class="mb-2 text-sm font-medium text-slate-700">วิธีชำระเงิน</p>
          <div class="mb-4 grid grid-cols-3 gap-2">
            <button
              v-for="method in methods"
              :key="method.value"
              :class="[
                'flex flex-col items-center gap-1 rounded-xl border-2 py-3 text-xs font-medium transition',
                selected === method.value
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300',
              ]"
              @click="selected = method.value"
            >
              <Icon :name="method.icon" class="h-5 w-5" />
              {{ method.label }}
            </button>
          </div>

          <!-- Cash input -->
          <div v-if="selected === 'cash'" class="mb-4">
            <label class="mb-1 block text-sm font-medium text-slate-700">รับเงินมา</label>
            <input
              v-model="cashReceivedStr"
              type="text"
              inputmode="decimal"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-right text-lg font-semibold outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="0.00"
              @blur="onCashBlur"
            />
            <div v-if="cashReceivedNum >= total" class="mt-2 flex justify-between text-sm">
              <span class="text-slate-500">เงินทอน</span>
              <span class="font-semibold text-green-600">{{ fmt.currency(cashReceivedNum - total) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              class="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              @click="$emit('close')"
            >
              ยกเลิก
            </button>
            <button
              :disabled="!canPay"
              class="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
              @click="confirm"
            >
              ยืนยันชำระ
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { PaymentMethod } from '~/types/order'

const props = defineProps<{ show: boolean; total: number }>()
const emit = defineEmits<{
  close: []
  confirm: [payload: { method: PaymentMethod; cashReceived?: number; change?: number }]
}>()

const selected = ref<PaymentMethod>('cash')
const cashReceivedStr = ref('')
const cashReceivedNum = computed(() => parseFloat(cashReceivedStr.value.replace(/,/g, '')) || 0)
const fmt = useFormatter()

const methods = [
  { value: 'cash' as PaymentMethod, label: 'เงินสด', icon: 'heroicons:banknotes' },
  { value: 'card' as PaymentMethod, label: 'บัตร', icon: 'heroicons:credit-card' },
  { value: 'promptpay' as PaymentMethod, label: 'พร้อมเพย์', icon: 'heroicons:qr-code' },
]

function onCashBlur() {
  const num = parseFloat(cashReceivedStr.value.replace(/,/g, ''))
  if (!isNaN(num) && num > 0) {
    cashReceivedStr.value = num.toFixed(2)
  } else {
    cashReceivedStr.value = ''
  }
}

const canPay = computed(() => {
  if (selected.value === 'cash') return cashReceivedNum.value >= props.total
  return true
})

function confirm() {
  emit('confirm', {
    method: selected.value,
    cashReceived: selected.value === 'cash' ? cashReceivedNum.value : undefined,
    change: selected.value === 'cash' ? cashReceivedNum.value - props.total : undefined,
  })
  cashReceivedStr.value = ''
}
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
