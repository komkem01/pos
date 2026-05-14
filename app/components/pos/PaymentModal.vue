<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="phase === 'pay' && $emit('close')"
      >
        <div class="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

          <!-- ══════════════════ PHASE 1: PAYMENT ══════════════════ -->
          <template v-if="phase === 'pay'">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 class="text-lg font-bold text-slate-800">ชำระเงิน</h2>
              <button
                class="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                @click="$emit('close')"
              >
                <Icon name="heroicons:x-mark" class="h-5 w-5" />
              </button>
            </div>

            <!-- Total banner -->
            <div class="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-7 text-center">
              <p class="text-sm font-medium text-blue-200">ยอดที่ต้องชำระ</p>
              <p class="mt-1 text-5xl font-extrabold tracking-tight text-white">{{ fmt.currency(total) }}</p>
            </div>

            <div class="space-y-5 px-6 py-5">
              <!-- Payment method -->
              <div>
                <p class="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">วิธีชำระเงิน</p>
                <div class="grid grid-cols-3 gap-2.5">
                  <button
                    v-for="m in methods"
                    :key="m.value"
                    :class="[
                      'flex flex-col items-center gap-2 rounded-2xl border-2 py-4 text-xs font-semibold transition active:scale-95',
                      selected === m.value
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm shadow-blue-100'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50',
                    ]"
                    @click="selected = m.value"
                  >
                    <Icon :name="m.icon" class="h-6 w-6" />
                    {{ m.label }}
                  </button>
                </div>
              </div>

              <!-- Cash section -->
              <div v-if="selected === 'cash'" class="space-y-3">
                <!-- Input -->
                <div>
                  <p class="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">รับเงินมา</p>
                  <div class="relative">
                    <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">฿</span>
                    <input
                      v-model="cashReceivedStr"
                      type="text"
                      inputmode="decimal"
                      placeholder="0.00"
                      class="h-14 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-10 pr-4 text-right text-2xl font-bold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      @blur="onCashBlur"
                      @focus="onCashFocus"
                    />
                  </div>
                </div>

                <!-- Quick amounts -->
                <div class="grid grid-cols-4 gap-2">
                  <button
                    v-for="q in quickAmounts"
                    :key="q.label"
                    class="rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
                    @click="setCash(q.value)"
                  >
                    {{ q.label }}
                  </button>
                </div>

                <!-- Change — BIG display -->
                <Transition
                  enter-active-class="transition-all duration-200"
                  enter-from-class="opacity-0 scale-95"
                  leave-active-class="transition-all duration-200"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div
                    v-if="cashReceivedNum >= total"
                    class="rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-5 py-4 text-center"
                  >
                    <p class="text-xs font-bold uppercase tracking-widest text-emerald-500">เงินทอน</p>
                    <p class="mt-1 text-5xl font-extrabold text-emerald-600">{{ fmt.currency(cashReceivedNum - total) }}</p>
                  </div>
                </Transition>
              </div>

              <!-- QR/card note -->
              <div v-else class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                <Icon name="heroicons:check-circle" class="mx-auto mb-1.5 h-6 w-6 text-slate-400" />
                กดยืนยันเมื่อชำระเงินเรียบร้อยแล้ว
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pb-1">
                <button
                  class="flex-1 rounded-2xl border-2 border-slate-200 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  @click="$emit('close')"
                >
                  ยกเลิก
                </button>
                <button
                  :disabled="!canPay"
                  class="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
                  @click="doConfirm"
                >
                  <Icon name="heroicons:banknotes" class="h-4 w-4" />
                  ยืนยันชำระเงิน
                </button>
              </div>
            </div>
          </template>

          <!-- ══════════════════ PHASE 2: RECEIPT ══════════════════ -->
          <template v-else>
            <!-- Success banner -->
            <div class="bg-gradient-to-br from-emerald-500 to-green-600 px-6 py-8 text-center text-white">
              <div class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <Icon name="heroicons:check" class="h-9 w-9 text-white" />
              </div>
              <p class="text-xl font-bold">ชำระเงินสำเร็จ</p>
              <p class="mt-0.5 text-sm text-green-100">{{ selectedMethod?.label }}</p>
            </div>

            <div class="px-6 py-5">
              <!-- Queue number -->
              <div class="mb-5 rounded-2xl border-2 border-amber-200 bg-amber-50 py-5 text-center">
                <p class="text-xs font-bold uppercase tracking-widest text-amber-500">หมายเลขคิว</p>
                <p class="mt-1 text-8xl font-black leading-none text-amber-500">{{ queueNo }}</p>
                <p class="mt-1 text-xs text-amber-400">เรียกลูกค้ารับสินค้า</p>
              </div>

              <!-- Payment details -->
              <div class="mb-5 space-y-2 rounded-2xl bg-slate-50 px-5 py-4 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-500">ยอดรวม</span>
                  <span class="font-bold text-slate-800">{{ fmt.currency(total) }}</span>
                </div>
                <template v-if="selected === 'cash'">
                  <div class="flex justify-between">
                    <span class="text-slate-500">รับเงินมา</span>
                    <span class="font-semibold text-slate-800">{{ fmt.currency(cashReceivedNum) }}</span>
                  </div>
                  <div class="flex justify-between border-t border-slate-200 pt-2">
                    <span class="font-bold text-emerald-600">เงินทอน</span>
                    <span class="text-2xl font-extrabold text-emerald-600">{{ fmt.currency(cashReceivedNum - total) }}</span>
                  </div>
                </template>
              </div>

              <!-- Buttons -->
              <div class="flex gap-3">
                <button
                  class="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95"
                  @click="printReceipt"
                >
                  <Icon name="heroicons:printer" class="h-4 w-4" />
                  ปริ้นใบเสร็จ
                </button>
                <button
                  class="flex-[2] rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 active:scale-[0.98]"
                  @click="done"
                >
                  ออเดอร์ใหม่
                </button>
              </div>
            </div>
          </template>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { PaymentMethod } from '~/types/order'

const props = defineProps<{
  show: boolean
  total: number
  storeName?: string
}>()

const emit = defineEmits<{
  close: []
  confirm: [payload: { method: PaymentMethod; cashReceived?: number; change?: number }]
  done: []
}>()

const fmt = useFormatter()
const setting = useSettingStore()
const orderStore = useOrderStore()

const phase = ref<'pay' | 'receipt'>('pay')
const selected = ref<PaymentMethod>('cash')
const cashReceivedStr = ref('')
const queueNo = ref('01')

const cashReceivedNum = computed(() => parseFloat(cashReceivedStr.value.replace(/,/g, '')) || 0)

const methods = [
  { value: 'cash' as PaymentMethod, label: 'เงินสด', icon: 'heroicons:banknotes' },
  { value: 'card' as PaymentMethod, label: 'บัตร', icon: 'heroicons:credit-card' },
  { value: 'promptpay' as PaymentMethod, label: 'พร้อมเพย์', icon: 'heroicons:qr-code' },
]

const selectedMethod = computed(() => methods.find((m) => m.value === selected.value))

// รีเซ็ตเมื่อเปิด modal ใหม่
watch(
  () => props.show,
  (v) => {
    if (v) {
      phase.value = 'pay'
      selected.value = 'cash'
      cashReceivedStr.value = ''
    }
  },
)

// ปุ่มจำนวนด่วน
const quickAmounts = computed(() => {
  const t = props.total
  const exact = { label: 'พอดี', value: t }
  const breakpoints = [50, 100, 500, 1000]
  const rounds = breakpoints
    .map((b) => Math.ceil(t / b) * b)
    .filter((v) => v > t)
    .slice(0, 3)
    .map((v) => ({ label: `฿${v.toLocaleString()}`, value: v }))
  return [exact, ...rounds].slice(0, 4)
})

function setCash(value: number) {
  cashReceivedStr.value = value.toFixed(2)
}

function onCashFocus() {
  if (cashReceivedNum.value === 0) cashReceivedStr.value = ''
}

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

function doConfirm() {
  // สร้างหมายเลขคิวจากจำนวน orders + 1
  const n = (orderStore.orders.length % 99) + 1
  queueNo.value = String(n).padStart(2, '0')

  emit('confirm', {
    method: selected.value,
    cashReceived: selected.value === 'cash' ? cashReceivedNum.value : undefined,
    change: selected.value === 'cash' ? cashReceivedNum.value - props.total : undefined,
  })

  phase.value = 'receipt'
}

function done() {
  emit('done')
}

function printReceipt() {
  const storeName = setting.storeName || 'POS ร้านค้า'
  const now = new Date().toLocaleString('th-TH')
  const changeAmt = selected.value === 'cash' ? cashReceivedNum.value - props.total : 0
  const html = `
    <!DOCTYPE html><html><head>
    <meta charset="utf-8"><title>ใบเสร็จ</title>
    <style>
      body { font-family: 'Courier New', monospace; font-size: 13px; width: 280px; margin: 0 auto; padding: 8px; }
      h2 { text-align: center; font-size: 16px; margin: 4px 0; }
      .center { text-align: center; }
      .line { border-top: 1px dashed #000; margin: 6px 0; }
      .row { display: flex; justify-content: space-between; }
      .big { font-size: 20px; font-weight: bold; }
      .queue { font-size: 48px; font-weight: 900; text-align: center; margin: 8px 0; }
    </style></head><body>
    <h2>${storeName}</h2>
    <p class="center">${now}</p>
    <div class="line"></div>
    <div class="queue">${queueNo.value}</div>
    <p class="center">หมายเลขคิว</p>
    <div class="line"></div>
    <div class="row"><span>ยอดรวม</span><span class="big">${fmt.currency(props.total)}</span></div>
    ${selected.value === 'cash' ? `
    <div class="row"><span>รับเงินมา</span><span>${fmt.currency(cashReceivedNum.value)}</span></div>
    <div class="row"><span>เงินทอน</span><span class="big">${fmt.currency(changeAmt)}</span></div>` : ''}
    <div class="line"></div>
    <p class="center">ขอบคุณที่ใช้บริการ</p>
    <script>window.onload=()=>{window.print();window.close();}<\/script>
    </body></html>`
  const w = window.open('', '_blank', 'width=320,height=500')
  if (w) {
    w.document.write(html)
    w.document.close()
  }
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

