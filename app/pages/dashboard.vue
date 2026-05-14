<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const orderStore = useOrderStore()
const fmt = useFormatter()

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
