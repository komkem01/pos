import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, SelectedOption } from '~/types/cart'
import type { Product } from '~/types/product'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const discountTotal = ref(0)
  const taxRate = ref(0.07)
  const customerId = ref<number | null>(null)
  const customerName = ref('')

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => {
      return sum + (item.product.price + item.optionExtra) * item.quantity - item.discount * item.quantity
    }, 0),
  )

  const tax = computed(() => (subtotal.value - discountTotal.value) * taxRate.value)

  const total = computed(() => subtotal.value - discountTotal.value)

  const itemCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0),
  )

  function addItem(
    product: Product,
    selectedOptions: SelectedOption[] = [],
    optionExtra: number = 0,
    qty: number = 1,
  ) {
    // ถ้าไม่มี options ให้รวมกับรายการเดิม (ถ้า options ว่าง)
    if (selectedOptions.length === 0) {
      const existing = items.value.find(
        (i) => i.product.id === product.id && i.selectedOptions.length === 0,
      )
      if (existing) {
        existing.quantity += qty
        return
      }
    }
    // มี options = เพิ่ม line ใหม่เสมอ
    items.value.push({
      id: `${product.id}-${Date.now()}`,
      product,
      quantity: qty,
      discount: 0,
      selectedOptions,
      optionExtra,
    })
  }

  function removeItem(itemId: string) {
    const index = items.value.findIndex((i) => i.id === itemId)
    if (index !== -1) items.value.splice(index, 1)
  }

  function updateQuantity(itemId: string, quantity: number) {
    const item = items.value.find((i) => i.id === itemId)
    if (!item) return
    if (quantity <= 0) removeItem(itemId)
    else item.quantity = quantity
  }

  function clear() {
    items.value = []
    discountTotal.value = 0
    customerId.value = null
    customerName.value = ''
  }

  return {
    items,
    discountTotal,
    taxRate,
    customerId,
    customerName,
    subtotal,
    tax,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  }
})
