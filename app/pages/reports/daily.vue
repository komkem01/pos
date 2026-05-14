<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-800">รายงานรายวัน</h2>
        <p class="text-sm text-slate-500">สรุปยอดขายแยกรายวัน</p>
      </div>
      <div class="flex items-center gap-2">
        <input type="month" class="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        <button class="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <Icon name="heroicons:arrow-down-tray" class="h-4 w-4" />
          ส่งออก
        </button>
      </div>
    </div>

    <!-- Chart placeholder -->
    <UiCard class="mb-6">
      <div class="flex h-48 items-center justify-center rounded-xl bg-slate-50">
        <!-- Fake bar chart -->
        <div class="flex h-32 w-full items-end gap-2 px-6">
          <div v-for="d in chartData" :key="d.day" class="flex flex-1 flex-col items-center gap-1">
            <span class="text-[10px] font-semibold text-blue-600">{{ d.label }}</span>
            <div class="w-full rounded-t-lg bg-blue-600 transition-all" :style="{ height: d.height + 'px' }" />
            <span class="text-[10px] text-slate-400">{{ d.day }}</span>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Daily table -->
    <UiCard padding="none">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">วันที่</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">จำนวนออเดอร์</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">เงินสด</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">QR/โอน</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">รวม</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="r in dailyRows" :key="r.date" class="hover:bg-slate-50">
            <td class="px-4 py-3 text-slate-700">{{ r.date }}</td>
            <td class="px-4 py-3 text-right tabular-nums text-slate-600">{{ r.orders }}</td>
            <td class="px-4 py-3 text-right tabular-nums text-slate-700">{{ r.cash }}</td>
            <td class="px-4 py-3 text-right tabular-nums text-slate-700">{{ r.qr }}</td>
            <td class="px-4 py-3 text-right font-bold tabular-nums text-slate-800">{{ r.total }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="border-t-2 border-slate-200 bg-slate-50 font-bold">
            <td class="px-4 py-3 text-slate-800">รวม</td>
            <td class="px-4 py-3 text-right tabular-nums text-slate-700">142</td>
            <td class="px-4 py-3 text-right tabular-nums text-slate-700">฿9,400</td>
            <td class="px-4 py-3 text-right tabular-nums text-slate-700">฿6,200</td>
            <td class="px-4 py-3 text-right tabular-nums text-blue-700">฿15,600</td>
          </tr>
        </tfoot>
      </table>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const chartData = [
  { day: '10', label: '฿2,400', height: 80 },
  { day: '11', label: '฿1,800', height: 60 },
  { day: '12', label: '฿3,100', height: 103 },
  { day: '13', label: '฿2,700', height: 90 },
  { day: '14', label: '฿1,500', height: 50 },
  { day: '15', label: '฿2,100', height: 70 },
]

const dailyRows = [
  { date: '15 พ.ค. 2569', orders: 28, cash: '฿1,820', qr: '฿820', total: '฿2,640' },
  { date: '14 พ.ค. 2569', orders: 19, cash: '฿980', qr: '฿520', total: '฿1,500' },
  { date: '13 พ.ค. 2569', orders: 35, cash: '฿2,100', qr: '฿1,000', total: '฿3,100' },
  { date: '12 พ.ค. 2569', orders: 31, cash: '฿1,900', qr: '฿800', total: '฿2,700' },
  { date: '11 พ.ค. 2569', orders: 15, cash: '฿900', qr: '฿600', total: '฿1,500' },
  { date: '10 พ.ค. 2569', orders: 14, cash: '฿1,700', qr: '฿700', total: '฿2,400' },
]
</script>
