<template>
  <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300">
    <div class="flex items-start gap-3">
      <!-- Product info -->
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-slate-800 leading-snug">{{ item.product.name }}</p>
        <p v-if="item.selectedOptions.length > 0" class="mt-0.5 truncate text-xs text-blue-500">
          {{ item.selectedOptions.map((o) => o.choiceLabels.join('+')).join(' · ') }}
        </p>
        <p class="mt-0.5 text-xs text-slate-400">{{ fmt.currency(item.product.price + item.optionExtra) }} / ชิ้น</p>
      </div>

      <!-- Subtotal + Remove -->
      <div class="flex flex-col items-end gap-1.5 shrink-0">
        <button
          class="flex h-6 w-6 items-center justify-center rounded-md text-slate-300 hover:bg-red-50 hover:text-red-400 transition"
          @click="$emit('remove', item.id)"
        >
          <Icon name="heroicons:x-mark" class="h-3.5 w-3.5" />
        </button>
        <p class="text-sm font-bold text-slate-800">
          {{ fmt.currency((item.product.price + item.optionExtra) * item.quantity) }}
        </p>
      </div>
    </div>

    <!-- Qty control row -->
    <div class="mt-2.5 flex items-center justify-between">
      <div class="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
        <button
          class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 active:scale-90"
          @click="$emit('decrease', item.id)"
        >
          <Icon name="heroicons:minus" class="h-3.5 w-3.5" />
        </button>
        <span class="w-6 text-center text-sm font-bold text-slate-800">{{ item.quantity }}</span>
        <button
          class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 active:scale-90"
          @click="$emit('increase', item.id)"
        >
          <Icon name="heroicons:plus" class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '~/types/cart'

defineProps<{ item: CartItem }>()
defineEmits<{
  increase: [id: string]
  decrease: [id: string]
  remove: [id: string]
}>()

const fmt = useFormatter()
</script>
