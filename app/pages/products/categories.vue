<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-800">หมวดหมู่สินค้า</h2>
        <p class="text-sm text-slate-500">จัดการหมวดหมู่สำหรับแบ่งกลุ่มสินค้า</p>
      </div>
      <button class="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
        <Icon name="heroicons:plus" class="h-4 w-4" />
        เพิ่มหมวดหมู่
      </button>
    </div>

    <!-- Category grid -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
      >
        <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl" :class="cat.bgColor">
          <Icon :name="cat.icon" class="h-6 w-6" :class="cat.iconColor" />
        </div>
        <p class="font-semibold text-slate-800">{{ cat.name }}</p>
        <p class="mt-0.5 text-xs text-slate-400">{{ cat.count }} รายการ</p>
        <!-- Actions -->
        <div class="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600">
            <Icon name="heroicons:pencil-square" class="h-3.5 w-3.5" />
          </button>
          <button class="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
            <Icon name="heroicons:trash" class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <!-- Add placeholder -->
      <button class="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-5 text-slate-400 transition hover:border-blue-300 hover:text-blue-500">
        <Icon name="heroicons:plus-circle" class="h-8 w-8" />
        <span class="text-xs font-medium">เพิ่มหมวดหมู่</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const categories = [
  { id: 1, name: 'เครื่องดื่ม', count: 12, icon: 'heroicons:beaker', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { id: 2, name: 'ของหวาน', count: 8, icon: 'heroicons:cake', bgColor: 'bg-pink-100', iconColor: 'text-pink-600' },
  { id: 3, name: 'อาหาร', count: 15, icon: 'heroicons:fire', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { id: 4, name: 'ของทานเล่น', count: 6, icon: 'heroicons:star', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { id: 5, name: 'สินค้าบรรจุภัณฑ์', count: 4, icon: 'heroicons:cube', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
]
</script>
