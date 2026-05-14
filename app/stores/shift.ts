import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { Shift, CashCount } from '~/types/shift'

export const useShiftStore = defineStore('shift', () => {
  const currentShift = useLocalStorage<Shift | null>('pos_current_shift', null)
  const history = useLocalStorage<Shift[]>('pos_shift_history', [])

  const isOpen = computed(() => currentShift.value?.status === 'open')

  function openShift(initialFund: number, openedBy: string) {
    currentShift.value = {
      id: `shift-${Date.now()}`,
      openedAt: new Date().toISOString(),
      openedBy,
      initialFund,
      status: 'open',
      systemCashSales: 0,
      systemQrSales: 0,
    }
  }

  /** เรียกหลังทุก Order ที่สำเร็จ */
  function addSales(cashAmount: number, qrAmount: number) {
    if (!currentShift.value || !isOpen.value) return
    currentShift.value = {
      ...currentShift.value,
      systemCashSales: currentShift.value.systemCashSales + cashAmount,
      systemQrSales: currentShift.value.systemQrSales + qrAmount,
    }
  }

  function closeShift(cashCount: CashCount, actualCashTotal: number, note: string) {
    if (!currentShift.value) return
    const expectedCash = currentShift.value.initialFund + currentShift.value.systemCashSales
    const closed: Shift = {
      ...currentShift.value,
      closedAt: new Date().toISOString(),
      status: 'closed',
      actualCashCount: cashCount,
      actualCashTotal,
      cashVariance: actualCashTotal - expectedCash,
      closingNote: note,
    }
    history.value = [closed, ...history.value]
    currentShift.value = null
  }

  return { currentShift, history, isOpen, openShift, addSales, closeShift }
})
