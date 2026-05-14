<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-800">จัดการสต็อก</h2>
        <p class="text-sm text-slate-500">ตรวจสอบและปรับจำนวนสต็อกสินค้า</p>
      </div>
      <button class="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
        <Icon name="heroicons:arrow-path" class="h-4 w-4" />
        ปรับสต็อก
      </button>
    </div>

    <!-- Summary cards -->
    <div class="mb-6 grid grid-cols-3 gap-4">
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">สินค้าทั้งหมด</p>
        <p class="mt-2 text-3xl font-extrabold text-slate-800">45</p>
      </div>
      <div class="rounded-2xl bg-amber-50 p-5 shadow-sm ring-1 ring-amber-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-amber-500">สต็อกใกล้หมด</p>
        <p class="mt-2 text-3xl font-extrabold text-amber-600">7</p>
      </div>
      <div class="rounded-2xl bg-red-50 p-5 shadow-sm ring-1 ring-red-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-red-500">หมดสต็อก</p>
        <p class="mt-2 text-3xl font-extrabold text-red-600">2</p>
      </div>
    </div>

    <!-- Stock table -->
    <UiCard padding="none">
      <div class="border-b border-slate-100 px-5 py-4">
        <input
          placeholder="ค้นหาสินค้า..."
          class="w-64 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">สินค้า</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">สต็อกปัจจุบัน</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">ขั้นต่ำ</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">สถานะ</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in stockItems" :key="item.id" class="hover:bg-slate-50">
            <td class="px-4 py-3 font-medium text-slate-800">{{ item.name }}</td>
            <td class="px-4 py-3 text-right font-bold tabular-nums" :class="item.qty <= item.min ? 'text-red-600' : 'text-slate-800'">
              {{ item.qty }}
            </td>
            <td class="px-4 py-3 text-right tabular-nums text-slate-500">{{ item.min }}</td>
            <td class="px-4 py-3 text-center">
              <span
                class="rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="item.qty === 0 ? 'bg-red-100 text-red-700' : item.qty <= item.min ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
              >
                {{ item.qty === 0 ? 'หมด' : item.qty <= item.min ? 'ใกล้หมด' : 'ปกติ' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <button class="rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50">ปรับ</button>
            </td>
          </tr>
        </tbody>
      </table>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const stockItems = [
  { id: 1, name: 'กาแฟอเมริกาโน่', qty: 50, min: 10 },
  { id: 2, name: 'ลาเต้', qty: 3, min: 10 },
  { id: 3, name: 'ชาไทย', qty: 0, min: 5 },
  { id: 4, name: 'มัทฉะลาเต้', qty: 8, min: 10 },
  { id: 5, name: 'โกโก้เย็น', qty: 25, min: 5 },
  { id: 6, name: 'วาฟเฟิล', qty: 2, min: 5 },
  { id: 7, name: 'บราวนี่', qty: 15, min: 5 },
]
</script>
