<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

        <!-- Header -->
        <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-8 text-white">
          <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
          <div class="pointer-events-none absolute -bottom-8 left-0 h-24 w-24 rounded-full bg-white/5" />
          <div class="relative z-10 flex items-center gap-4">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
              <Icon name="heroicons:building-storefront" class="h-7 w-7 text-white" />
            </div>
            <div>
              <p class="text-xs font-medium text-blue-200">{{ todayDate }}</p>
              <h1 class="text-xl font-extrabold">เปิดกะวันนี้</h1>
              <p class="text-sm text-blue-200">ระบุเงินสำรองก่อนเริ่มขาย</p>
            </div>
          </div>
          <!-- Cashier badge -->
          <div class="relative z-10 mt-5 flex items-center gap-2.5 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <Icon name="heroicons:user-circle" class="h-5 w-5 text-blue-200" />
            <div>
              <p class="text-[10px] font-semibold uppercase tracking-widest text-blue-300">แคชเชียร์</p>
              <p class="text-sm font-bold text-white">{{ auth.username }}</p>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="space-y-6 px-6 py-6">

          <!-- Initial fund -->
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">
              เงินสำรองเริ่มต้น
              <span class="ml-1 text-xs font-normal text-slate-400">(ใส่ 0 ถ้าไม่มี)</span>
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">฿</span>
              <input
                ref="fundInput"
                v-model="fundDisplay"
                inputmode="decimal"
                placeholder="0.00"
                :class="[
                  'h-14 w-full rounded-2xl border-2 bg-slate-50 pl-10 pr-4 text-right text-2xl font-bold outline-none transition',
                  'focus:bg-white focus:ring-4 focus:ring-blue-100',
                  fundError ? 'border-red-300 text-red-600 focus:border-red-400' : 'border-slate-200 text-slate-800 focus:border-blue-400',
                ]"
                @focus="onFundFocus"
                @blur="onFundBlur"
                @keyup.enter="submit"
              />
            </div>
            <p v-if="fundError" class="mt-1.5 flex items-center gap-1 text-xs text-red-500">
              <Icon name="heroicons:exclamation-circle" class="h-3.5 w-3.5" />{{ fundError }}
            </p>
            <!-- Quick presets -->
            <div class="mt-2.5 grid grid-cols-4 gap-2">
              <button
                v-for="p in presets"
                :key="p"
                class="rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
                @click="setPreset(p)"
              >
                ฿{{ p.toLocaleString() }}
              </button>
            </div>
          </div>

          <!-- Checklist -->
          <div>
            <p class="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">รายการตรวจสอบก่อนเปิดร้าน</p>
            <div class="space-y-2">
              <button
                v-for="item in checklist"
                :key="item.label"
                class="flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition active:scale-[0.99]"
                :class="item.checked
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'"
                @click="item.checked = !item.checked"
              >
                <div
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition"
                  :class="item.checked ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'"
                >
                  <Icon v-if="item.checked" name="heroicons:check" class="h-3.5 w-3.5 text-white" />
                </div>
                <span class="text-sm font-medium" :class="item.checked ? 'text-emerald-700' : 'text-slate-600'">{{ item.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 pb-6">
          <button
            class="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98]"
            @click="submit"
          >
            <Icon name="heroicons:play-circle" class="h-5 w-5" />
            เปิดร้านเริ่มขาย
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
const emit = defineEmits<{ opened: [] }>()

const auth = useAuthStore()
const shift = useShiftStore()
const fundInput = ref<HTMLInputElement | null>(null)

const fundDisplay = ref('0.00')
const fundValue = ref(0)
const fundError = ref('')

const presets = [500, 1000, 2000, 5000]

const todayDate = computed(() =>
  new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
)

const checklist = reactive([
  { label: 'เตรียมเงินทอนในลิ้นชักพร้อมแล้ว', checked: false },
  { label: 'เปิดระบบเครื่องพิมพ์ใบเสร็จแล้ว', checked: false },
  { label: 'ตรวจสอบสต็อกสินค้าเบื้องต้นแล้ว', checked: false },
])

function setPreset(val: number) {
  fundValue.value = val
  fundDisplay.value = val.toFixed(2)
}

function onFundFocus() {
  if (fundValue.value === 0) fundDisplay.value = ''
  else fundDisplay.value = String(fundValue.value)
}

function onFundBlur() {
  const n = parseFloat(fundDisplay.value.replace(/,/g, ''))
  fundValue.value = !isNaN(n) && n >= 0 ? n : 0
  fundDisplay.value = fundValue.value.toFixed(2)
  fundError.value = ''
}

function submit() {
  onFundBlur()
  if (fundValue.value < 0) {
    fundError.value = 'กรุณาระบุเงินสำรอง'
    fundInput.value?.focus()
    return
  }
  shift.openShift(fundValue.value, auth.username)
  emit('opened')
}
</script>
