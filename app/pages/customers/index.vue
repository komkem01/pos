<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="font-semibold text-slate-700">ลูกค้าทั้งหมด ({{ customerStore.customers.length }})</h2>
      <button class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
        <Icon name="heroicons:plus" class="h-4 w-4" />
        เพิ่มลูกค้า
      </button>
    </div>

    <UiCard padding="none">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">ชื่อ</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">เบอร์โทร</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">คะแนน</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">ยอดซื้อรวม</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="c in customerStore.customers" :key="c.id" class="hover:bg-slate-50">
            <td class="px-4 py-3 font-medium text-slate-800">{{ c.name }}</td>
            <td class="px-4 py-3 text-slate-500">{{ c.phone ?? '-' }}</td>
            <td class="px-4 py-3 text-right text-slate-600">{{ c.points }}</td>
            <td class="px-4 py-3 text-right font-semibold text-slate-800">{{ fmt.currency(c.totalSpent) }}</td>
          </tr>
        </tbody>
      </table>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const customerStore = useCustomerStore()
const fmt = useFormatter()
</script>
