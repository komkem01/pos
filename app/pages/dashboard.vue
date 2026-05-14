<template>
  <div>
    <!-- Shift Status Card -->
    <div class="mb-6">
      <div
        v-if="shift.isOpen"
        class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <Icon name="heroicons:building-storefront" class="h-7 w-7 text-white" />
            </div>
            <div>
              <p class="text-xs font-medium text-green-100">ร้านเปิดอยู่</p>
              <p class="text-lg font-bold">กะโดย: {{ shift.currentShift?.openedBy }}</p>
              <p class="text-xs text-green-100">เปิดตั้งแต่ {{ openedAtFmt }}</p>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-right">
              <p class="text-xs text-green-100">ยอดขายในกะ</p>
              <p class="text-2xl font-extrabold">{{ fmt.currency((shift.currentShift?.systemCashSales ?? 0) + (shift.currentShift?.systemQrSales ?? 0)) }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <NuxtLink
                to="/pos"
                class="flex items-center gap-1.5 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/30 transition"
              >
                <Icon name="heroicons:arrow-right-circle" class="h-4 w-4" />
                หน้าขาย
              </NuxtLink>
              <button
                class="flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/30 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition"
                @click="showCloseShift = true"
              >
                <Icon name="heroicons:lock-closed" class="h-4 w-4" />
                ปิดกะ
              </button>
            </div>
          </div>
        </div>
        <!-- Decorative blob -->
        <div class="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      </div>

      <!-- No active shift -->
      <div
        v-else
        class="flex items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-4"
      >
        <div class="flex items-center gap-3 text-slate-500">
          <Icon name="heroicons:building-storefront" class="h-6 w-6" />
          <span class="text-sm">ร้านยังไม่เปิด — ไม่มีกะที่ใช้งานอยู่</span>
        </div>
        <button
          class="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition active:scale-95"
          @click="showOpenShift = true"
        >
          <Icon name="heroicons:play-circle" class="h-4 w-4" />
          เปิดร้าน
        </button>
      </div>
    </div>

    <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <UiCard v-for="stat in stats" :key="stat.label" padding="md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-500">{{ stat.label }}</p>
            <p class="mt-1 text-xl font-bold text-slate-800">{{ stat.value }}</p>
          </div>
          <div :class="`rounded-lg p-2 ${stat.bgColor}`">
            <Icon :name="stat.icon" :class="`h-5 w-5 ${stat.iconColor}`" />
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Recent Orders -->
    <UiCard title="ออเดอร์ล่าสุด">
      <div v-if="orderStore.orders.length" class="divide-y divide-slate-100">
        <div
          v-for="order in orderStore.orders.slice(0, 8)"
          :key="order.id"
          class="flex items-center justify-between py-2.5"
        >
          <div>
            <p class="text-sm font-medium text-slate-800">{{ order.orderNo }}</p>
            <p class="text-xs text-slate-400">{{ fmt.datetime(order.createdAt) }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-slate-800">{{ fmt.currency(order.total) }}</p>
            <p class="text-xs text-slate-400">{{ order.items.length }} รายการ</p>
          </div>
        </div>
      </div>
      <div v-else class="py-8 text-center text-sm text-slate-400">ยังไม่มีออเดอร์</div>
    </UiCard>

    <!-- Close Shift Modal -->
    <PosCloseShiftModal
      :show="showCloseShift"
      @close="showCloseShift = false"
      @closed="onShiftClosed"
    />

    <!-- Open Shift Modal -->
    <PosOpenShiftModal :show="showOpenShift" @opened="onShiftOpened" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const orderStore = useOrderStore()
const shift = useShiftStore()
const toast = useToast()
const fmt = useFormatter()

const showCloseShift = ref(false)
const showOpenShift = ref(false)

const openedAtFmt = computed(() => {
  if (!shift.currentShift) return ''
  return new Date(shift.currentShift.openedAt).toLocaleString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short',
  })
})

async function onShiftClosed() {
  showCloseShift.value = false
  toast.success('ปิดกะและสรุปยอดเรียบร้อยแล้ว')
}

async function onShiftOpened() {
  showOpenShift.value = false
  toast.success('เปิดร้านเรียบร้อยแล้ว!')
  await navigateTo('/pos')
}

const stats = computed(() => [
  {
    label: 'ยอดขายวันนี้',
    value: fmt.currency(orderStore.todayTotal()),
    icon: 'heroicons:banknotes',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    label: 'ออเดอร์วันนี้',
    value: orderStore.todayCount(),
    icon: 'heroicons:shopping-bag',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'สินค้าทั้งหมด',
    value: useProductStore().products.length,
    icon: 'heroicons:archive-box',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    label: 'ลูกค้าทั้งหมด',
    value: useCustomerStore().customers.length,
    icon: 'heroicons:user-group',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
])
</script>
