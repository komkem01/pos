<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="font-semibold text-slate-700">สินค้าทั้งหมด ({{ productStore.products.length }})</h2>
      <button class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
        <Icon name="heroicons:plus" class="h-4 w-4" />
        เพิ่มสินค้า
      </button>
    </div>

    <UiCard padding="none">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">สินค้า</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">SKU</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">ราคา</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">สต็อก</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">สถานะ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="p in productStore.products" :key="p.id" class="hover:bg-slate-50">
            <td class="px-4 py-3 font-medium text-slate-800">{{ p.name }}</td>
            <td class="px-4 py-3 text-slate-500">{{ p.sku }}</td>
            <td class="px-4 py-3 text-right font-semibold text-slate-800">{{ fmt.currency(p.price) }}</td>
            <td class="px-4 py-3 text-right text-slate-600">{{ p.stock }}</td>
            <td class="px-4 py-3 text-center">
              <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                ใช้งาน
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
const productStore = useProductStore()
const fmt = useFormatter()
</script>
