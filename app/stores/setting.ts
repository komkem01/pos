import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore('setting', () => {
  const storeName = ref('ร้านอาหาร POS')
  const taxRate = ref(0.07)
  const taxEnabled = ref(false)
  const currency = ref('฿')
  const receiptFooter = ref('ขอบคุณที่ใช้บริการ')

  return { storeName, taxRate, taxEnabled, currency, receiptFooter }
})
