<template>
  <div>
    <div class="mb-4">
      <h2 class="font-semibold text-slate-700">ประวัติออเดอร์ ({{ orderStore.orders.length }})</h2>
    </div>

    <UiCard padding="none">
      <div v-if="orderStore.orders.length">
        <table class="w-full text-sm">
          <thead class="border-b border-slate-200 bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">เลขออเดอร์</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">วันที่</th>
              <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">รายการ</th>
              <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">ยอดรวม</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">ชำระ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="order in orderStore.orders" :key="order.id" class="hover:bg-slate-50">
              <td class="px-4 py-3 font-medium text-slate-800">{{ order.orderNo }}</td>
              <td class="px-4 py-3 text-slate-500">{{ fmt.datetime(order.createdAt) }}</td>
              <td class="px-4 py-3 text-right text-slate-600">{{ order.items.length }}</td>
              <td class="px-4 py-3 text-right font-semibold text-slate-800">{{ fmt.currency(order.total) }}</td>
              <td class="px-4 py-3">
                <span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {{ paymentLabel[order.paymentMethod] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="py-12 text-center text-sm text-slate-400">ยังไม่มีออเดอร์</div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import type { PaymentMethod } from '~/types/order'

definePageMeta({ layout: 'default' })

const orderStore = useOrderStore()
const fmt = useFormatter()

const paymentLabel: Record<PaymentMethod, string> = {
  cash: 'เงินสด',
  card: 'บัตร',
  promptpay: 'พร้อมเพย์',
}
</script>
