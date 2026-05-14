<template>
  <div>
    <div class="mb-6">
      <h2 class="text-lg font-bold text-slate-800">รายงานกะ</h2>
      <p class="text-sm text-slate-500">ประวัติการเปิด-ปิดกะทั้งหมด</p>
    </div>

    <UiCard padding="none">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">กะ</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">เปิดโดย</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">เวลาเปิด</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">เวลาปิด</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">เงินตั้งต้น</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">ยอดขาย</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">ส่วนต่าง</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">สถานะ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="s in shifts" :key="s.id" class="hover:bg-slate-50">
            <td class="px-4 py-3 font-mono text-xs font-semibold text-slate-500">#{{ s.id }}</td>
            <td class="px-4 py-3 font-medium text-slate-700">{{ s.by }}</td>
            <td class="px-4 py-3 text-slate-500">{{ s.open }}</td>
            <td class="px-4 py-3 text-slate-500">{{ s.close ?? '—' }}</td>
            <td class="px-4 py-3 text-right tabular-nums text-slate-700">{{ s.fund }}</td>
            <td class="px-4 py-3 text-right font-semibold tabular-nums text-slate-800">{{ s.sales }}</td>
            <td class="px-4 py-3 text-right tabular-nums font-bold" :class="s.variance === '฿0' ? 'text-slate-400' : s.variance.startsWith('-') ? 'text-red-600' : 'text-emerald-600'">
              {{ s.variance }}
            </td>
            <td class="px-4 py-3 text-center">
              <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="s.status === 'ปิดแล้ว' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'">
                {{ s.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const shifts = [
  { id: '005', by: 'admin', open: '15 พ.ค. · 09:00', close: '15 พ.ค. · 21:00', fund: '฿1,000', sales: '฿4,820', variance: '฿0', status: 'ปิดแล้ว' },
  { id: '004', by: 'admin', open: '14 พ.ค. · 09:00', close: '14 พ.ค. · 20:45', fund: '฿1,000', sales: '฿3,210', variance: '-฿50', status: 'ปิดแล้ว' },
  { id: '003', by: 'admin', open: '13 พ.ค. · 08:30', close: '13 พ.ค. · 21:15', fund: '฿500', sales: '฿5,100', variance: '฿0', status: 'ปิดแล้ว' },
  { id: '002', by: 'admin', open: '12 พ.ค. · 09:00', close: '12 พ.ค. · 20:00', fund: '฿1,000', sales: '฿2,700', variance: '+฿20', status: 'ปิดแล้ว' },
  { id: '001', by: 'admin', open: '11 พ.ค. · 09:00', close: '11 พ.ค. · 19:00', fund: '฿1,000', sales: '฿1,500', variance: '฿0', status: 'ปิดแล้ว' },
]
</script>
