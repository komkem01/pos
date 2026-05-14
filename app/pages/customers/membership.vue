<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-800">สมาชิก / พอยท์</h2>
        <p class="text-sm text-slate-500">จัดการระดับสมาชิกและพอยท์สะสม</p>
      </div>
      <button class="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
        <Icon name="heroicons:plus" class="h-4 w-4" />
        เพิ่มระดับสมาชิก
      </button>
    </div>

    <!-- Tier cards -->
    <div class="mb-6 grid grid-cols-3 gap-4">
      <div v-for="tier in tiers" :key="tier.name" class="overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200">
        <div class="px-5 py-4" :class="tier.headerBg">
          <div class="flex items-center gap-3">
            <Icon :name="tier.icon" class="h-6 w-6" :class="tier.iconColor" />
            <div>
              <p class="font-bold" :class="tier.titleColor">{{ tier.name }}</p>
              <p class="text-xs" :class="tier.subColor">{{ tier.count }} สมาชิก</p>
            </div>
          </div>
        </div>
        <div class="bg-white px-5 py-3 text-xs text-slate-500">
          <p>ยอดสะสม: <span class="font-semibold text-slate-700">{{ tier.minSpend }}</span></p>
          <p class="mt-0.5">พอยท์: <span class="font-semibold text-slate-700">{{ tier.pointRate }}</span></p>
        </div>
      </div>
    </div>

    <!-- Members table -->
    <UiCard padding="none">
      <div class="border-b border-slate-100 px-5 py-4">
        <input placeholder="ค้นหาสมาชิก..." class="w-64 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
      </div>
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">ชื่อ</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">เบอร์โทร</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">ระดับ</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">พอยท์</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">ยอดสะสม</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="m in members" :key="m.id" class="hover:bg-slate-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                  {{ m.name.charAt(0) }}
                </div>
                <span class="font-medium text-slate-800">{{ m.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-slate-500">{{ m.phone }}</td>
            <td class="px-4 py-3 text-center">
              <span class="rounded-full px-2.5 py-0.5 text-xs font-bold" :class="m.tierClass">{{ m.tier }}</span>
            </td>
            <td class="px-4 py-3 text-right font-semibold tabular-nums text-slate-800">{{ m.points }}</td>
            <td class="px-4 py-3 text-right tabular-nums text-slate-600">{{ m.total }}</td>
          </tr>
        </tbody>
      </table>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const tiers = [
  { name: 'Silver', count: 42, icon: 'heroicons:star', iconColor: 'text-slate-500', headerBg: 'bg-slate-100', titleColor: 'text-slate-700', subColor: 'text-slate-400', minSpend: '฿0+', pointRate: '1 บาท = 1 พอยท์' },
  { name: 'Gold', count: 18, icon: 'heroicons:star', iconColor: 'text-yellow-500', headerBg: 'bg-yellow-50', titleColor: 'text-yellow-700', subColor: 'text-yellow-400', minSpend: '฿5,000+', pointRate: '1 บาท = 1.5 พอยท์' },
  { name: 'Platinum', count: 5, icon: 'heroicons:sparkles', iconColor: 'text-blue-500', headerBg: 'bg-blue-50', titleColor: 'text-blue-700', subColor: 'text-blue-400', minSpend: '฿20,000+', pointRate: '1 บาท = 2 พอยท์' },
]

const members = [
  { id: 1, name: 'สมชาย ใจดี', phone: '081-234-5678', tier: 'Gold', tierClass: 'bg-yellow-100 text-yellow-700', points: '1,240', total: '฿12,400' },
  { id: 2, name: 'นิดา รักสวย', phone: '089-876-5432', tier: 'Silver', tierClass: 'bg-slate-100 text-slate-600', points: '320', total: '฿3,200' },
  { id: 3, name: 'วิทย์ เก่งมาก', phone: '062-111-2222', tier: 'Platinum', tierClass: 'bg-blue-100 text-blue-700', points: '8,500', total: '฿42,500' },
  { id: 4, name: 'มาลี สวยงาม', phone: '091-333-4444', tier: 'Silver', tierClass: 'bg-slate-100 text-slate-600', points: '90', total: '฿900' },
]
</script>
