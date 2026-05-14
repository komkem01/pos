import { ref, computed, watch, isRef } from 'vue'
import type { Ref, ComputedRef } from 'vue'

export function usePagination<T>(
  items: Ref<T[]> | ComputedRef<T[]>,
  pageSizeInput: number | Ref<number> = 12,
) {
  const pageSizeRef: Ref<number> = isRef(pageSizeInput) ? pageSizeInput : ref(pageSizeInput)
  const currentPage = ref(1)

  const totalItems = computed(() => items.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSizeRef.value)))

  // Reset to first page whenever source list or page size changes
  watch([items, pageSizeRef], () => {
    currentPage.value = 1
  })

  const paged = computed<T[]>(() => {
    const start = (currentPage.value - 1) * pageSizeRef.value
    return items.value.slice(start, start + pageSizeRef.value)
  })

  const startItem = computed(() =>
    totalItems.value === 0 ? 0 : (currentPage.value - 1) * pageSizeRef.value + 1,
  )
  const endItem = computed(() =>
    Math.min(currentPage.value * pageSizeRef.value, totalItems.value),
  )

  function goTo(page: number) {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  }

  function next() {
    if (currentPage.value < totalPages.value) currentPage.value++
  }

  function prev() {
    if (currentPage.value > 1) currentPage.value--
  }

  /** Visible page numbers with -1 as ellipsis sentinel */
  const pageNumbers = computed<number[]>(() => {
    const total = totalPages.value
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    const cur = currentPage.value
    const pages: number[] = [1]

    if (cur > 3) pages.push(-1) // left ellipsis

    const rangeStart = Math.max(2, cur - 1)
    const rangeEnd = Math.min(total - 1, cur + 1)
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)

    if (cur < total - 2) pages.push(-1) // right ellipsis
    pages.push(total)

    return pages
  })

  return {
    currentPage,
    totalPages,
    totalItems,
    startItem,
    endItem,
    paged,
    pageNumbers,
    goTo,
    next,
    prev,
  }
}
