<template>
  <div>
    <!-- ── Header + date range ──────────────────────────────────────────── -->
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-bold text-slate-800">ประวัติออเดอร์</h2>
        <p class="text-sm text-slate-500">ค้นหาตามช่วงวันที่</p>
      </div>
      <div class="flex items-center gap-2">
        <UiDatePicker v-model="dateFrom" placeholder="เลือกวันที่" />
        <Icon name="heroicons:arrow-right" class="h-4 w-4 shrink-0 text-slate-300" />
        <UiDatePicker v-model="dateTo" placeholder="เลือกวันที่" />
        <button
          class="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
          @click="clearDates"
        >
          ล้าง
        </button>
      </div>
    </div>

    <!-- ── Stats for range ──────────────────────────────────────────────── -->
    <div class="mb-5 grid grid-cols-4 gap-4">
      <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">ออเดอร์ในช่วง</p>
        <p class="mt-2 text-2xl font-extrabold text-slate-800">{{ rangeCount }}</p>
      </div>
      <div class="rounded-2xl bg-blue-50 p-4 shadow-sm ring-1 ring-blue-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-blue-500">ยอดรวมในช่วง</p>
        <p class="mt-2 text-2xl font-extrabold text-blue-700">{{ fmt.currency(rangeTotal) }}</p>
      </div>
      <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">เฉลี่ย/ออเดอร์</p>
        <p class="mt-2 text-2xl font-extrabold text-slate-800">{{ fmt.currency(rangeAvg) }}</p>
      </div>
      <div class="rounded-2xl bg-emerald-50 p-4 shadow-sm ring-1 ring-emerald-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-emerald-600">ยอดสูงสุด</p>
        <p class="mt-2 text-2xl font-extrabold text-emerald-700">{{ fmt.currency(rangeMax) }}</p>
      </div>
    </div>

    <!-- ── Table ────────────────────────────────────────────────────────── -->
    <UiCard padding="none">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">เลขออเดอร์</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">วันที่</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">รายการ</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">ยอดรวม</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">ช่องทาง</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">สถานะ</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="order in pagination.paged.value"
            :key="order.id"
            class="hover:bg-blue-50/40"
          >
            <td class="px-4 py-3 font-mono text-xs font-semibold text-slate-700">{{ order.orderNo }}</td>
            <td class="px-4 py-3 text-slate-500">{{ fmt.datetime(order.createdAt) }}</td>
            <td class="px-4 py-3 text-center text-slate-600">{{ order.items.length }}</td>
            <td class="px-4 py-3 text-right font-semibold tabular-nums text-slate-800">{{ fmt.currency(order.total) }}</td>
            <td class="px-4 py-3 text-center">
              <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="paymentClass[order.paymentMethod]">
                {{ paymentLabel[order.paymentMethod] }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass[order.status]">
                {{ statusLabel[order.status] }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <button
                class="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                title="ดูรายละเอียด"
                @click="viewOrder(order)"
              >
                <Icon name="heroicons:eye" class="h-4 w-4" />
              </button>
            </td>
          </tr>
          <tr v-if="pagination.paged.value.length === 0">
            <td colspan="7" class="py-16 text-center text-slate-400">
              <Icon name="heroicons:clipboard-document-list" class="mx-auto mb-2 h-10 w-10 opacity-30" />
              <p class="text-sm">ไม่พบออเดอร์ในช่วงที่เลือก</p>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="border-t border-slate-100 px-5 py-4">
        <UiPaginate
          :current-page="pagination.currentPage.value"
          :total-pages="pagination.totalPages.value"
          :total-items="pagination.totalItems.value"
          :start-item="pagination.startItem.value"
          :end-item="pagination.endItem.value"
          :page-numbers="pagination.pageNumbers.value"
          @update:current-page="pagination.goTo"
        />
      </div>
    </UiCard>

    <!-- ── Order Detail Modal ─────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="selectedOrder"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="selectedOrder = null"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 class="text-base font-bold text-slate-800">{{ selectedOrder.orderNo }}</h3>
              <p class="mt-0.5 text-xs text-slate-400">{{ fmt.datetime(selectedOrder.createdAt) }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass[selectedOrder.status]">
                {{ statusLabel[selectedOrder.status] }}
              </span>
              <button class="rounded-lg p-1 text-slate-400 hover:bg-slate-100" @click="selectedOrder = null">
                <Icon name="heroicons:x-mark" class="h-5 w-5" />
              </button>
            </div>
          </div>
          <!-- Items -->
          <div class="max-h-60 overflow-y-auto px-6 py-4">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-xs text-slate-400">
                  <th class="pb-2 text-left font-semibold">สินค้า</th>
                  <th class="pb-2 text-center font-semibold">จำนวน</th>
                  <th class="pb-2 text-right font-semibold">ราคา</th>
                  <th class="pb-2 text-right font-semibold">รวม</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="item in selectedOrder.items" :key="item.productId">
                  <td class="py-2 text-slate-700">{{ item.productName }}</td>
                  <td class="py-2 text-center text-slate-500">× {{ item.quantity }}</td>
                  <td class="py-2 text-right tabular-nums text-slate-500">{{ fmt.currency(item.price) }}</td>
                  <td class="py-2 text-right tabular-nums font-medium text-slate-800">{{ fmt.currency(item.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Totals -->
          <div class="space-y-1 border-t border-slate-100 px-6 py-4">
            <div class="flex justify-between text-sm text-slate-500">
              <span>ยอดรวมสินค้า</span>
              <span class="tabular-nums">{{ fmt.currency(selectedOrder.subtotal) }}</span>
            </div>
            <div v-if="selectedOrder.discountTotal > 0" class="flex justify-between text-sm text-red-500">
              <span>ส่วนลด</span>
              <span class="tabular-nums">-{{ fmt.currency(selectedOrder.discountTotal) }}</span>
            </div>
            <div v-if="selectedOrder.tax > 0" class="flex justify-between text-sm text-slate-500">
              <span>ภาษี</span>
              <span class="tabular-nums">{{ fmt.currency(selectedOrder.tax) }}</span>
            </div>
            <div class="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-800">
              <span>ยอดสุทธิ</span>
              <span class="tabular-nums">{{ fmt.currency(selectedOrder.total) }}</span>
            </div>
          </div>
          <!-- Payment info -->
          <div class="rounded-b-2xl bg-slate-50 px-6 py-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-500">ช่องทางชำระ</span>
              <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="paymentClass[selectedOrder.paymentMethod]">
                {{ paymentLabel[selectedOrder.paymentMethod] }}
              </span>
            </div>
            <template v-if="selectedOrder.paymentMethod === 'cash' && selectedOrder.cashReceived">
              <div class="mt-1 flex justify-between text-sm text-slate-500">
                <span>รับเงิน</span>
                <span class="tabular-nums">{{ fmt.currency(selectedOrder.cashReceived!) }}</span>
              </div>
              <div class="flex justify-between text-sm text-slate-500">
                <span>ทอน</span>
                <span class="tabular-nums">{{ fmt.currency(selectedOrder.change ?? 0) }}</span>
              </div>
            </template>
            <div v-if="selectedOrder.customerName" class="mt-1 flex justify-between text-sm text-slate-500">
              <span>ลูกค้า</span>
              <span>{{ selectedOrder.customerName }}</span>
            </div>
            <div v-if="selectedOrder.note" class="mt-1 flex justify-between text-sm text-slate-500">
              <span>หมายเหตุ</span>
              <span>{{ selectedOrder.note }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Order, PaymentMethod, OrderStatus } from '~/types/order'

definePageMeta({ layout: 'default' })

const orderStore = useOrderStore()
const fmt = useFormatter()

// ── Date range ────────────────────────────────────────────────────────────────
const dateFrom = ref('')
const dateTo = ref('')

function clearDates() {
  dateFrom.value = ''
  dateTo.value = ''
}

// ── Filtered list ─────────────────────────────────────────────────────────────
const filtered = computed(() => {
  return orderStore.orders.filter((o) => {
    const day = o.createdAt.slice(0, 10)
    if (dateFrom.value && day < dateFrom.value) return false
    if (dateTo.value && day > dateTo.value) return false
    return true
  })
})

// ── Stats ─────────────────────────────────────────────────────────────────────
const completedInRange = computed(() =>
  filtered.value.filter(o => o.status === 'completed'),
)
const rangeCount = computed(() => completedInRange.value.length)
const rangeTotal = computed(() => completedInRange.value.reduce((s, o) => s + o.total, 0))
const rangeAvg   = computed(() => rangeCount.value > 0 ? rangeTotal.value / rangeCount.value : 0)
const rangeMax   = computed(() =>
  completedInRange.value.length > 0 ? Math.max(...completedInRange.value.map(o => o.total)) : 0,
)

// ── Pagination ────────────────────────────────────────────────────────────────
const pagination = usePagination(filtered, 15)

// ── Labels & classes ──────────────────────────────────────────────────────────
const paymentLabel: Record<PaymentMethod, string> = {
  cash:      'เงินสด',
  card:      'บัตร',
  promptpay: 'พร้อมเพย์',
}
const paymentClass: Record<PaymentMethod, string> = {
  cash:      'bg-emerald-100 text-emerald-700',
  card:      'bg-blue-100 text-blue-700',
  promptpay: 'bg-purple-100 text-purple-700',
}
const statusLabel: Record<OrderStatus, string> = {
  completed: 'สำเร็จ',
  cancelled: 'ยกเลิก',
  refunded:  'คืนเงิน',
}
const statusClass: Record<OrderStatus, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-500',
  refunded:  'bg-amber-100 text-amber-700',
}

// ── Detail modal ──────────────────────────────────────────────────────────────
const selectedOrder = ref<Order | null>(null)

function viewOrder(order: Order) {
  selectedOrder.value = order
}
</script>
