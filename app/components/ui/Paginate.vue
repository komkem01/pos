<template>
  <div
    v-if="totalPages > 1 || showAlways"
    class="flex items-center justify-between gap-4 select-none"
  >
    <!-- Items info -->
    <p class="text-sm text-slate-500 shrink-0">
      <span class="font-medium text-slate-700"
        >{{ startItem }}–{{ endItem }}</span
      >
      จาก
      <span class="font-medium text-slate-700">{{ totalItems }}</span>
      รายการ
    </p>

    <!-- Page controls -->
    <div class="flex items-center gap-1">
      <!-- Prev -->
      <button
        :disabled="currentPage <= 1"
        class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        @click="$emit('update:currentPage', currentPage - 1)"
      >
        <Icon name="heroicons:chevron-left" class="h-4 w-4" />
      </button>

      <!-- Page numbers -->
      <template v-for="(page, idx) in pageNumbers" :key="idx">
        <!-- Ellipsis -->
        <span
          v-if="page === -1"
          class="flex h-9 w-9 items-center justify-center text-slate-400 text-sm"
        >
          …
        </span>
        <!-- Page button -->
        <button
          v-else
          :class="[
            'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition active:scale-95',
            page === currentPage
              ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-200'
              : 'border-slate-200 text-slate-600 hover:bg-slate-100',
          ]"
          @click="$emit('update:currentPage', page)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        :disabled="currentPage >= totalPages"
        class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        @click="$emit('update:currentPage', currentPage + 1)"
      >
        <Icon name="heroicons:chevron-right" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  pageNumbers: number[];
  showAlways?: boolean;
}>();

defineEmits<{ "update:currentPage": [page: number] }>();
</script>
