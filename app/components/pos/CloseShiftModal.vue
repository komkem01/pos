<template>
  <Teleport to="body">
    <Transition name="shift-modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      >
        <div class="flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl" style="max-height: 96vh">

          <!-- Header -->
          <div class="relative shrink-0 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-5 text-white">
            <div class="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/5" />
            <div class="relative z-10 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-extrabold">ปิดกะและสรุปยอด</h2>
                <p class="mt-0.5 text-xs text-blue-200">
                  เปิดกะเมื่อ {{ openedAtDisplay }} · {{ shift.currentShift?.openedBy }}
                </p>
              </div>
              <!-- Step indicators -->
              <div class="flex items-center gap-2">
                <div
                  v-for="s in steps"
                  :key="s.n"
                  class="flex items-center gap-1.5"
                >
                  <div
                    :class="[
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all',
                      step > s.n
                        ? 'bg-emerald-500 text-white'
                        : step === s.n
                          ? 'bg-blue-500 text-white ring-2 ring-blue-400/40'
                          : 'bg-white/10 text-slate-400',
                    ]"
                  >
                    <Icon v-if="step > s.n" name="heroicons:check" class="h-4 w-4" />
                    <span v-else>{{ s.n }}</span>
                  </div>
                  <div v-if="s.n < 3" class="h-px w-4 rounded" :class="step > s.n ? 'bg-emerald-500' : 'bg-white/20'" />
                </div>
              </div>
            </div>
            <!-- Step label -->
            <p class="relative z-10 mt-3 text-sm font-semibold text-blue-100">
              {{ steps[step - 1]?.label }}
            </p>
          </div>

          <!-- Scrollable content -->
          <div class="flex-1 overflow-y-auto">

            <!-- ══ STEP 1: นับเงิน ══ -->
            <div v-if="step === 1" class="space-y-4 px-6 py-5">
              <div class="overflow-hidden rounded-2xl border border-slate-200">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                      <th class="px-4 py-3 text-left font-bold">ธนบัตร / เหรียญ</th>
                      <th class="px-4 py-3 text-center font-bold">จำนวน</th>
                      <th class="px-4 py-3 text-right font-bold">รวม</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="row in denomRows" :key="row.key" class="hover:bg-slate-50/50">
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <span class="inline-flex min-w-[52px] items-center justify-center rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                            ฿{{ row.value }}
                          </span>
                          <span class="text-slate-600">{{ row.shortLabel }}</span>
                        </div>
                      </td>
                      <td class="px-3 py-2">
                        <UiInput
                          :model-value="cashCount[row.key]"
                          type="integer"
                          placeholder="0"
                          align="right"
                          @update:model-value="(v) => (cashCount[row.key] = v as number)"
                        />
                      </td>
                      <td class="px-4 py-3 text-right font-semibold tabular-nums text-slate-700">
                        {{ fmt.currency(row.value * (cashCount[row.key] || 0)) }}
                      </td>
                    </tr>
                    <tr class="hover:bg-slate-50/50">
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <span class="inline-flex min-w-[52px] items-center justify-center rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">เหรียญ</span>
                          <span class="text-slate-600">มูลค่ารวม</span>
                        </div>
                      </td>
                      <td class="px-3 py-2" colspan="1">
                        <UiInput
                          :model-value="cashCount.coinsTotal"
                          type="decimal"
                          placeholder="0.00"
                          align="right"
                          @update:model-value="(v) => (cashCount.coinsTotal = v as number)"
                        />
                      </td>
                      <td class="px-4 py-3 text-right font-semibold tabular-nums text-slate-700">
                        {{ fmt.currency(cashCount.coinsTotal || 0) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="border-t-2 border-blue-200 bg-blue-600 text-white">
                      <td class="px-4 py-3.5 font-bold" colspan="2">รวมเงินสดที่นับได้</td>
                      <td class="px-4 py-3.5 text-right text-xl font-extrabold tabular-nums">
                        {{ fmt.currency(actualCashTotal) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- ══ STEP 2: สรุปผล ══ -->
            <div v-if="step === 2" class="space-y-4 px-6 py-5">
              <!-- Variance highlight -->
              <div
                v-if="totalVariance !== 0"
                :class="[
                  'flex items-center gap-3 rounded-2xl border-2 px-5 py-4',
                  totalVariance < 0
                    ? 'border-red-200 bg-red-50'
                    : 'border-emerald-200 bg-emerald-50',
                ]"
              >
                <Icon
                  :name="totalVariance < 0 ? 'heroicons:exclamation-triangle' : 'heroicons:information-circle'"
                  class="h-6 w-6 shrink-0"
                  :class="totalVariance < 0 ? 'text-red-500' : 'text-emerald-500'"
                />
                <div>
                  <p class="text-sm font-bold" :class="totalVariance < 0 ? 'text-red-700' : 'text-emerald-700'">
                    {{ totalVariance < 0 ? `เงินขาด ${fmt.currency(Math.abs(totalVariance))}` : `เงินเกิน ${fmt.currency(totalVariance)}` }}
                  </p>
                  <p class="text-xs" :class="totalVariance < 0 ? 'text-red-500' : 'text-emerald-500'">กรุณาบันทึกเหตุผลในขั้นตอนถัดไป</p>
                </div>
              </div>
              <div v-else class="flex items-center gap-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-5 py-4">
                <Icon name="heroicons:check-circle" class="h-6 w-6 shrink-0 text-emerald-500" />
                <p class="text-sm font-bold text-emerald-700">ยอดเงินตรงกัน — ไม่มีส่วนต่าง</p>
              </div>

              <div class="overflow-hidden rounded-2xl border border-slate-200">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                      <th class="px-4 py-3 text-left font-bold">รายการ</th>
                      <th class="px-4 py-3 text-right font-bold">ระบบ</th>
                      <th class="px-4 py-3 text-right font-bold">จริง</th>
                      <th class="px-4 py-3 text-right font-bold">ส่วนต่าง</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="row in summaryRows" :key="row.label" class="hover:bg-slate-50/50">
                      <td class="px-4 py-3 text-slate-600">{{ row.label }}</td>
                      <td class="px-4 py-3 text-right tabular-nums text-slate-700">{{ fmt.currency(row.system) }}</td>
                      <td class="px-4 py-3 text-right tabular-nums text-slate-700">{{ fmt.currency(row.actual) }}</td>
                      <td
                        class="px-4 py-3 text-right tabular-nums font-bold"
                        :class="row.variance < 0 ? 'text-red-600' : row.variance > 0 ? 'text-emerald-600' : 'text-slate-300'"
                      >
                        {{ row.variance === 0 ? '—' : (row.variance > 0 ? '+' : '') + fmt.currency(row.variance) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="border-t-2 border-slate-300 bg-slate-800 text-white font-bold">
                      <td class="px-4 py-3.5">รวมสุทธิ</td>
                      <td class="px-4 py-3.5 text-right tabular-nums">{{ fmt.currency(totalSystem) }}</td>
                      <td class="px-4 py-3.5 text-right tabular-nums">{{ fmt.currency(totalActual) }}</td>
                      <td
                        class="px-4 py-3.5 text-right tabular-nums text-base font-extrabold"
                        :class="totalVariance < 0 ? 'text-red-400' : totalVariance > 0 ? 'text-emerald-400' : 'text-slate-400'"
                      >
                        {{ totalVariance === 0 ? '—' : (totalVariance > 0 ? '+' : '') + fmt.currency(totalVariance) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- ══ STEP 3: ยืนยัน ══ -->
            <div v-if="step === 3" class="space-y-4 px-6 py-5">
              <!-- Mini summary cards -->
              <div class="grid grid-cols-3 gap-3">
                <div class="rounded-2xl bg-slate-50 p-4 text-center">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">เงินตั้งต้น</p>
                  <p class="mt-1.5 text-lg font-extrabold text-slate-800">{{ fmt.currency(shift.currentShift?.initialFund ?? 0) }}</p>
                </div>
                <div class="rounded-2xl bg-blue-50 p-4 text-center">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">ยอดขายรวม</p>
                  <p class="mt-1.5 text-lg font-extrabold text-blue-700">
                    {{ fmt.currency((shift.currentShift?.systemCashSales ?? 0) + (shift.currentShift?.systemQrSales ?? 0)) }}
                  </p>
                </div>
                <div
                  class="rounded-2xl p-4 text-center"
                  :class="totalVariance < 0 ? 'bg-red-50' : totalVariance > 0 ? 'bg-emerald-50' : 'bg-slate-50'"
                >
                  <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">ส่วนต่าง</p>
                  <p
                    class="mt-1.5 text-lg font-extrabold"
                    :class="totalVariance < 0 ? 'text-red-600' : totalVariance > 0 ? 'text-emerald-600' : 'text-slate-400'"
                  >
                    {{ totalVariance === 0 ? '—' : (totalVariance > 0 ? '+' : '') + fmt.currency(totalVariance) }}
                  </p>
                </div>
              </div>

              <!-- Note -->
              <div>
                <label class="mb-2 block text-sm font-bold text-slate-700">
                  บันทึกเพิ่มเติม
                  <span v-if="totalVariance !== 0" class="ml-1 text-xs font-normal text-red-500">* จำเป็นเมื่อมีส่วนต่าง</span>
                </label>
                <textarea
                  v-model="closingNote"
                  rows="3"
                  placeholder="เช่น ทอนเงินผิด ฿50 / จ่ายค่าพัสดุ ฿120..."
                  :class="[
                    'w-full resize-none rounded-2xl border-2 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-300',
                    noteError
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100',
                  ]"
                />
                <p v-if="noteError" class="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <Icon name="heroicons:exclamation-circle" class="h-3.5 w-3.5" />{{ noteError }}
                </p>
              </div>

              <!-- Final warning -->
              <div class="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                <Icon name="heroicons:exclamation-triangle" class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p class="text-xs text-amber-700">เมื่อยืนยันแล้วจะไม่สามารถแก้ไขข้อมูลกะนี้ได้</p>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="flex shrink-0 items-center gap-3 border-t border-slate-100 px-6 py-4">
            <button
              v-if="step > 1"
              class="flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95"
              @click="step--"
            >
              <Icon name="heroicons:arrow-left" class="h-4 w-4" />
              ย้อนกลับ
            </button>
            <button
              v-else
              class="rounded-2xl border-2 border-slate-200 px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
              @click="$emit('close')"
            >
              ยกเลิก
            </button>

            <button
              v-if="step < 3"
              class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98]"
              @click="nextStep"
            >
              ถัดไป
              <Icon name="heroicons:arrow-right" class="h-4 w-4" />
            </button>
            <button
              v-else
              class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 text-sm font-bold text-white shadow-md shadow-rose-200 transition hover:bg-rose-700 active:scale-[0.98]"
              @click="confirmClose"
            >
              <Icon name="heroicons:lock-closed" class="h-4 w-4" />
              ยืนยันปิดกะ
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { CashCount } from '~/types/shift'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: []; closed: [] }>()

const shift = useShiftStore()
const fmt = useFormatter()

const step = ref(1)
const closingNote = ref('')
const noteError = ref('')

const steps = [
  { n: 1, label: 'ขั้นที่ 1 — นับเงินในลิ้นชัก' },
  { n: 2, label: 'ขั้นที่ 2 — เปรียบเทียบยอดกับระบบ' },
  { n: 3, label: 'ขั้นที่ 3 — ยืนยันและปิดกะ' },
]

// Reset state when modal opens
watch(() => props.show, (v) => {
  if (v) {
    step.value = 1
    closingNote.value = ''
    noteError.value = ''
    cashCount.bills1000 = 0
    cashCount.bills500 = 0
    cashCount.bills100 = 0
    cashCount.bills50 = 0
    cashCount.bills20 = 0
    cashCount.coinsTotal = 0
  }
})

const cashCount = reactive<CashCount>({
  bills1000: 0,
  bills500: 0,
  bills100: 0,
  bills50: 0,
  bills20: 0,
  coinsTotal: 0,
})

const denomRows = [
  { key: 'bills1000' as keyof CashCount, label: 'ธนบัตร ฿1,000', shortLabel: 'ธนบัตร', value: 1000 },
  { key: 'bills500' as keyof CashCount, label: 'ธนบัตร ฿500', shortLabel: 'ธนบัตร', value: 500 },
  { key: 'bills100' as keyof CashCount, label: 'ธนบัตร ฿100', shortLabel: 'ธนบัตร', value: 100 },
  { key: 'bills50' as keyof CashCount, label: 'ธนบัตร ฿50', shortLabel: 'ธนบัตร', value: 50 },
  { key: 'bills20' as keyof CashCount, label: 'ธนบัตร ฿20', shortLabel: 'ธนบัตร', value: 20 },
]

const actualCashTotal = computed(
  () =>
    (cashCount.bills1000 || 0) * 1000 +
    (cashCount.bills500 || 0) * 500 +
    (cashCount.bills100 || 0) * 100 +
    (cashCount.bills50 || 0) * 50 +
    (cashCount.bills20 || 0) * 20 +
    (cashCount.coinsTotal || 0),
)

const openedAtDisplay = computed(() => {
  if (!shift.currentShift) return ''
  return new Date(shift.currentShift.openedAt).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  })
})

// Comparison table data
const systemCash = computed(() => shift.currentShift?.systemCashSales ?? 0)
const systemQr = computed(() => shift.currentShift?.systemQrSales ?? 0)
const initialFund = computed(() => shift.currentShift?.initialFund ?? 0)
const expectedCashInDrawer = computed(() => initialFund.value + systemCash.value)

const summaryRows = computed(() => [
  {
    label: 'เงินตั้งต้น',
    system: initialFund.value,
    actual: initialFund.value,
    variance: 0,
  },
  {
    label: 'ยอดขายเงินสด',
    system: systemCash.value,
    actual: actualCashTotal.value - initialFund.value,
    variance: actualCashTotal.value - initialFund.value - systemCash.value,
  },
  {
    label: 'ยอดโอน / QR',
    system: systemQr.value,
    actual: systemQr.value,
    variance: 0,
  },
])

const totalSystem = computed(() => initialFund.value + systemCash.value + systemQr.value)
const totalActual = computed(() => actualCashTotal.value + systemQr.value)
const totalVariance = computed(() => totalActual.value - totalSystem.value)

function nextStep() {
  step.value++
}

function confirmClose() {
  if (totalVariance.value !== 0 && !closingNote.value.trim()) {
    noteError.value = 'กรุณาบันทึกเหตุผลที่เงินขาด/เกิน'
    return
  }
  shift.closeShift({ ...cashCount }, actualCashTotal.value, closingNote.value.trim())
  emit('closed')
}
</script>

<style scoped>
.shift-modal-enter-active,
.shift-modal-leave-active {
  transition: opacity 0.2s ease;
}
.shift-modal-enter-from,
.shift-modal-leave-to {
  opacity: 0;
}
</style>
