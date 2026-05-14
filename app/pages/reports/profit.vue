<template>
  <div>
    <div class="mb-6">
      <h2 class="text-lg font-bold text-slate-800">กำไร-ขาดทุน</h2>
      <p class="text-sm text-slate-500">วิเคราะห์ต้นทุนและกำไรสุทธิ</p>
    </div>

    <!-- Summary -->
    <div class="mb-6 grid grid-cols-4 gap-4">
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">รายได้รวม</p>
        <p class="mt-2 text-2xl font-extrabold text-slate-800">฿15,600</p>
        <p class="mt-1 flex items-center gap-1 text-xs text-emerald-500"><Icon name="heroicons:arrow-up" class="h-3 w-3" />+12% vs เดือนก่อน</p>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">ต้นทุนรวม</p>
        <p class="mt-2 text-2xl font-extrabold text-slate-800">฿8,200</p>
        <p class="mt-1 flex items-center gap-1 text-xs text-red-400"><Icon name="heroicons:arrow-up" class="h-3 w-3" />+5% vs เดือนก่อน</p>
      </div>
      <div class="rounded-2xl bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-emerald-500">กำไรสุทธิ</p>
        <p class="mt-2 text-2xl font-extrabold text-emerald-700">฿7,400</p>
        <p class="mt-1 text-xs text-emerald-500">Margin 47.4%</p>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">สินค้าขายดี</p>
        <p class="mt-2 text-base font-extrabold text-slate-800">ลาเต้</p>
        <p class="mt-1 text-xs text-slate-400">148 แก้ว</p>
      </div>
    </div>

    <!-- Top products -->
    <UiCard title="สินค้าทำกำไรสูงสุด" class="mb-6">
      <div class="space-y-3">
        <div v-for="(p, i) in topProducts" :key="p.name" class="flex items-center gap-3">
          <span class="w-5 text-center text-xs font-bold text-slate-400">{{ i + 1 }}</span>
          <div class="flex-1">
            <div class="mb-1 flex justify-between text-xs">
              <span class="font-semibold text-slate-700">{{ p.name }}</span>
              <span class="font-bold text-emerald-600">{{ p.profit }}</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-emerald-500 transition-all" :style="{ width: p.pct + '%' }" />
            </div>
          </div>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const topProducts = [
  { name: 'ลาเต้', profit: '฿2,220', pct: 100 },
  { name: 'อเมริกาโน่', profit: '฿1,680', pct: 75 },
  { name: 'มัทฉะลาเต้', profit: '฿1,240', pct: 56 },
  { name: 'ชาไทยเย็น', profit: '฿980', pct: 44 },
  { name: 'วาฟเฟิล', profit: '฿720', pct: 32 },
]
</script>
