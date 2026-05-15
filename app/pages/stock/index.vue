<template>
  <div>
    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-800">จัดการสต็อก</h2>
        <p class="text-sm text-slate-500">ตรวจสอบและปรับจำนวนสต็อกสินค้า</p>
      </div>
    </div>

    <!-- ── Summary Cards ──────────────────────────────────────────────────── -->
    <div class="mb-6 grid grid-cols-3 gap-4">
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">สินค้าทั้งหมด</p>
        <p class="mt-2 text-3xl font-extrabold text-slate-800">{{ stockItems.length }}</p>
      </div>
      <div class="rounded-2xl bg-amber-50 p-5 shadow-sm ring-1 ring-amber-200">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-wider text-amber-500">สต็อกใกล้หมด</p>
          <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-amber-400" />
        </div>
        <p class="mt-2 text-3xl font-extrabold text-amber-600">{{ lowCount }}</p>
      </div>
      <div class="rounded-2xl bg-red-50 p-5 shadow-sm ring-1 ring-red-200">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-wider text-red-500">หมดสต็อก</p>
          <Icon name="heroicons:x-circle" class="h-5 w-5 text-red-400" />
        </div>
        <p class="mt-2 text-3xl font-extrabold text-red-600">{{ outCount }}</p>
      </div>
    </div>

    <!-- ── Filter bar ─────────────────────────────────────────────────────── -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-52">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="search"
          placeholder="ค้นหาสินค้า..."
          class="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <div class="flex gap-2">
        <button
          v-for="f in statusFilters"
          :key="f.value"
          class="rounded-full border px-3 py-1 text-xs font-medium transition"
          :class="activeFilter === f.value
            ? 'border-blue-600 bg-blue-600 text-white'
            : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600'"
          @click="activeFilter = (f.value as 'all' | 'low' | 'out')"
        >
          {{ f.label }}
          <span
            v-if="f.count > 0"
            class="ml-1 rounded-full px-1.5 py-px text-xs"
            :class="activeFilter === f.value ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'"
          >{{ f.count }}</span>
        </button>
      </div>
    </div>

    <!-- ── Stock Table ────────────────────────────────────────────────────── -->
    <UiCard padding="none">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">สินค้า</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">สต็อกปัจจุบัน</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">ขั้นต่ำ</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">สถานะ</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">ปรับสต็อก</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in filtered" :key="item.id" class="hover:bg-slate-50">
            <!-- Product info -->
            <td class="px-4 py-3">
              <p class="font-medium text-slate-800">{{ item.name }}</p>
              <p class="text-xs text-slate-400">{{ item.sku }}</p>
            </td>
            <!-- Current qty -->
            <td class="px-4 py-3 text-center">
              <span
                class="text-lg font-extrabold tabular-nums"
                :class="item.qty === 0 ? 'text-red-600' : item.qty <= item.min ? 'text-amber-600' : 'text-slate-800'"
              >{{ item.qty }}</span>
            </td>
            <!-- Min level -->
            <td class="px-4 py-3 text-center tabular-nums text-slate-500">{{ item.min }}</td>
            <!-- Status badge -->
            <td class="px-4 py-3 text-center">
              <span
                class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                :class="item.qty === 0
                  ? 'bg-red-100 text-red-700'
                  : item.qty <= item.min
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'"
              >
                {{ item.qty === 0 ? 'หมดสต็อก' : item.qty <= item.min ? 'ใกล้หมด' : 'ปกติ' }}
              </span>
            </td>
            <!-- Adjust button -->
            <td class="px-4 py-3 text-center">
              <button
                class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                @click="openAdjust(item)"
              >
                <Icon name="heroicons:arrow-path" class="mr-1 inline h-3.5 w-3.5" />
                ปรับ
              </button>
            </td>
          </tr>
          <!-- Empty state -->
          <tr v-if="filtered.length === 0">
            <td colspan="5" class="py-16 text-center text-slate-400">
              <Icon name="heroicons:archive-box" class="mx-auto mb-2 h-10 w-10 opacity-30" />
              <p class="text-sm">ไม่พบสินค้า</p>
            </td>
          </tr>
        </tbody>
      </table>
    </UiCard>

    <!-- ── Adjust Stock Modal ─────────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="adjustTarget"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="adjustTarget = null"
      >
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 class="text-base font-bold text-slate-800">ปรับสต็อก</h3>
              <p class="text-sm text-slate-500">{{ adjustTarget?.name }} · สต็อกปัจจุบัน {{ adjustTarget?.qty }}</p>
            </div>
            <button class="rounded-lg p-1 text-slate-400 hover:bg-slate-100" @click="adjustTarget = null">
              <Icon name="heroicons:x-mark" class="h-5 w-5" />
            </button>
          </div>
          <!-- Body -->
          <div class="space-y-4 px-6 py-5">
            <!-- Movement type -->
            <div>
              <label class="mb-2 block text-xs font-semibold text-slate-600">ประเภทการปรับ</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="t in movementTypes"
                  :key="t.value"
                  class="flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition"
                  :class="adjustForm.type === t.value
                    ? `border-${t.color}-400 bg-${t.color}-50 text-${t.color}-700`
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'"
                  @click="adjustForm.type = t.value"
                >
                  <Icon :name="t.icon" class="h-5 w-5" />
                  {{ t.label }}
                </button>
              </div>
            </div>
            <!-- Quantity -->
            <UiInput v-model="adjustForm.quantity" type="integer" label="จำนวน *" :error="adjustError" />
            <!-- Reason -->
            <div>
              <label class="mb-1 block text-xs font-semibold text-slate-600">เหตุผล <span class="text-red-500">*</span></label>
              <select
                v-model="adjustForm.reason"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">เลือกเหตุผล...</option>
                <option value="รับสินค้าใหม่">รับสินค้าใหม่</option>
                <option value="ขายออก">ขายออก</option>
                <option value="สินค้าเสีย/หมดอายุ">สินค้าเสีย / หมดอายุ</option>
                <option value="ปรับยอดตรวจนับ">ปรับยอดตรวจนับ</option>
                <option value="คืนสินค้า">คืนสินค้า</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <!-- Preview -->
            <div class="rounded-xl bg-slate-50 p-3 text-sm">
              <div class="flex justify-between text-slate-500">
                <span>สต็อกก่อนปรับ</span>
                <span class="font-semibold text-slate-700">{{ adjustTarget?.qty }}</span>
              </div>
              <div class="my-1 flex justify-between text-slate-500">
                <span>{{ adjustForm.type === 'in' ? 'รับเข้า' : adjustForm.type === 'out' ? 'จ่ายออก' : 'ปรับเป็น' }}</span>
                <span class="font-semibold" :class="adjustForm.type === 'in' ? 'text-emerald-600' : 'text-red-600'">
                  {{ adjustForm.type === 'in' ? '+' : adjustForm.type === 'out' ? '-' : '' }}{{ adjustForm.quantity }}
                </span>
              </div>
              <div class="flex justify-between border-t border-slate-200 pt-1 text-slate-500">
                <span>สต็อกหลังปรับ</span>
                <span class="font-extrabold text-slate-800">{{ previewQty }}</span>
              </div>
            </div>

          </div>
          <!-- Footer -->
          <div class="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" @click="adjustTarget = null">ยกเลิก</button>
            <button class="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700" @click="doAdjust">บันทึก</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const toast = useToast()

// ── Mock data ─────────────────────────────────────────────────────────────────
interface StockItem { id: number; name: string; sku: string; qty: number; min: number }

const stockItems = ref<StockItem[]>([
  { id: 1,  name: 'กาแฟอเมริกาโน่', sku: 'DR005', qty: 50, min: 10 },
  { id: 2,  name: 'ลาเต้',           sku: 'DR006', qty: 3,  min: 10 },
  { id: 3,  name: 'ชาไทย',           sku: 'DR003', qty: 0,  min: 5  },
  { id: 4,  name: 'มัทฉะลาเต้',     sku: 'DR007', qty: 8,  min: 10 },
  { id: 5,  name: 'โกโก้เย็น',       sku: 'DR008', qty: 25, min: 5  },
  { id: 6,  name: 'วาฟเฟิล',         sku: 'DT004', qty: 2,  min: 5  },
  { id: 7,  name: 'บราวนี่',          sku: 'DT003', qty: 15, min: 5  },
  { id: 8,  name: 'น้ำเปล่า',        sku: 'DR001', qty: 50, min: 10 },
  { id: 9,  name: 'โค้ก',            sku: 'DR002', qty: 40, min: 10 },
  { id: 10, name: 'เค้กช็อกโกแลต',  sku: 'DT002', qty: 0,  min: 5  },
])

// ── Computed summaries ────────────────────────────────────────────────────────
const lowCount = computed(() => stockItems.value.filter(i => i.qty > 0 && i.qty <= i.min).length)
const outCount = computed(() => stockItems.value.filter(i => i.qty === 0).length)

// ── Filters ───────────────────────────────────────────────────────────────────
const search       = ref('')
const activeFilter = ref<'all' | 'low' | 'out'>('all')

const statusFilters = computed(() => [
  { value: 'all', label: 'ทั้งหมด', count: 0 },
  { value: 'low', label: 'ใกล้หมด', count: lowCount.value },
  { value: 'out', label: 'หมดสต็อก', count: outCount.value },
])

const filtered = computed(() => {
  let list = stockItems.value
  if (search.value)            list = list.filter(i => i.name.toLowerCase().includes(search.value.toLowerCase()) || i.sku.toLowerCase().includes(search.value.toLowerCase()))
  if (activeFilter.value === 'low') list = list.filter(i => i.qty > 0 && i.qty <= i.min)
  if (activeFilter.value === 'out') list = list.filter(i => i.qty === 0)
  return list
})

// ── Adjust modal ──────────────────────────────────────────────────────────────
const adjustTarget = ref<StockItem | null>(null)
const adjustError  = ref('')

const adjustForm = reactive({
  type: 'in' as 'in' | 'out' | 'adjust',
  quantity: 1,
  reason: '',
})

const movementTypes = [
  { value: 'in',     label: 'รับเข้า',  icon: 'heroicons:arrow-down-tray', color: 'emerald' },
  { value: 'out',    label: 'จ่ายออก',  icon: 'heroicons:arrow-up-tray',   color: 'red' },
  { value: 'adjust', label: 'ปรับยอด', icon: 'heroicons:pencil',           color: 'blue' },
] as const

const previewQty = computed(() => {
  if (!adjustTarget.value) return 0
  const q = adjustForm.quantity || 0
  if (adjustForm.type === 'in')     return adjustTarget.value.qty + q
  if (adjustForm.type === 'out')    return Math.max(0, adjustTarget.value.qty - q)
  if (adjustForm.type === 'adjust') return q
  return adjustTarget.value.qty
})

function openAdjust(item: StockItem) {
  adjustTarget.value = item
  Object.assign(adjustForm, { type: 'in', quantity: 1, reason: '' })
  adjustError.value = ''
}

function doAdjust() {
  if (!adjustTarget.value)           { adjustError.value = 'ไม่พบสินค้า'; return }
  if (adjustForm.quantity <= 0)      { adjustError.value = 'จำนวนต้องมากกว่า 0'; return }
  if (!adjustForm.reason)            { adjustError.value = 'กรุณาเลือกเหตุผล'; return }

  const idx = stockItems.value.findIndex(i => i.id === adjustTarget.value!.id)
  if (idx !== -1) {
    stockItems.value[idx]!.qty = previewQty.value
  }
  toast.success(`ปรับสต็อก "${adjustTarget.value.name}" สำเร็จ (เหลือ ${previewQty.value})`)
  adjustTarget.value = null
}
</script>
