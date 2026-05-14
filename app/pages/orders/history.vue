<template>
  <div>
    <!-- Header + filters -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-800">ประวัติออเดอร์</h2>
        <p class="text-sm text-slate-500">ออเดอร์ที่เสร็จสมบูรณ์ทั้งหมด</p>
      </div>
      <div class="flex items-center gap-2">
        <input
          type="date"
          class="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <button class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <Icon name="heroicons:funnel" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Stats row -->
    <div class="mb-6 grid grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label" class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs text-slate-500">{{ s.label }}</p>
        <p class="mt-1.5 text-xl font-extrabold" :class="s.color">{{ s.value }}</p>
      </div>
    </div>

    <!-- History table -->
    <UiCard padding="none">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">เลขออเดอร์</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">วันที่</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">รายการ</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">ยอดรวม</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">ช่องทาง</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">แคชเชียร์</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="order in orders" :key="order.id" class="cursor-pointer hover:bg-slate-50">
            <td class="px-4 py-3 font-mono text-xs font-semibold text-slate-600">#{{ order.id }}</td>
            <td class="px-4 py-3 text-slate-600">{{ order.date }}</td>
            <td class="px-4 py-3 text-slate-500">{{ order.items }} รายการ</td>
            <td class="px-4 py-3 text-right font-bold tabular-nums text-slate-800">{{ order.total }}</td>
            <td class="px-4 py-3 text-center">
              <span
                class="rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="order.method === 'เงินสด' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'"
              >{{ order.method }}</span>
            </td>
            <td class="px-4 py-3 text-center text-slate-500">{{ order.cashier }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination placeholder -->
      <div class="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <span class="text-xs text-slate-400">แสดง 1–10 จาก 128 รายการ</span>
        <div class="flex gap-1">
          <button class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50">ก่อนหน้า</button>
          <button class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50">ถัดไป</button>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const stats = [
  { label: 'ออเดอร์วันนี้', value: '28', color: 'text-slate-800' },
  { label: 'ยอดรวมวันนี้', value: '฿4,820', color: 'text-blue-600' },
  { label: 'เฉลี่ยต่อออเดอร์', value: '฿172', color: 'text-slate-800' },
  { label: 'ออเดอร์เดือนนี้', value: '612', color: 'text-slate-800' },
]

const orders = [
  { id: '0128', date: '15 พ.ค. 69 · 14:32', items: 3, total: '฿185', method: 'เงินสด', cashier: 'admin' },
  { id: '0127', date: '15 พ.ค. 69 · 13:50', items: 1, total: '฿60', method: 'QR', cashier: 'admin' },
  { id: '0126', date: '15 พ.ค. 69 · 12:15', items: 5, total: '฿420', method: 'เงินสด', cashier: 'admin' },
  { id: '0125', date: '15 พ.ค. 69 · 11:30', items: 2, total: '฿130', method: 'QR', cashier: 'admin' },
  { id: '0124', date: '15 พ.ค. 69 · 10:45', items: 4, total: '฿310', method: 'เงินสด', cashier: 'admin' },
]
</script>
