<template>
  <button
    class="group flex flex-col items-start rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-300 hover:shadow-md active:scale-95 active:bg-blue-50"
    @click="$emit('add', product)"
  >
    <!-- Image placeholder -->
    <div class="mb-3 flex h-32 w-full items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 transition">
      <Icon name="heroicons:photo" class="h-10 w-10 text-slate-300 group-hover:text-blue-300 transition" />
    </div>
    <p class="line-clamp-2 text-sm font-semibold text-slate-800 leading-snug">{{ product.name }}</p>
    <p class="mt-0.5 text-xs text-slate-400">{{ product.sku }}</p>
    <div class="mt-2 flex w-full items-center justify-between">
      <p class="text-base font-bold text-blue-600">{{ fmt.currency(product.price) }}</p>
      <div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition">
        <Icon name="heroicons:plus" class="h-3.5 w-3.5 text-white" />
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

defineProps<{ product: Product }>()
defineEmits<{ add: [product: Product] }>()

const fmt = useFormatter()
</script>
