import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order } from '~/types/order'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  let counter = 1

  function generateOrderNo(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    return `ORD-${dateStr}-${String(counter++).padStart(4, '0')}`
  }

  function addOrder(order: Omit<Order, 'id' | 'orderNo' | 'createdAt'>) {
    const newOrder: Order = {
      ...order,
      id: orders.value.length + 1,
      orderNo: generateOrderNo(),
      createdAt: new Date().toISOString(),
    }
    orders.value.unshift(newOrder)
    return newOrder
  }

  const todayTotal = () => {
    const today = new Date().toISOString().slice(0, 10)
    return orders.value
      .filter((o) => o.status === 'completed' && o.createdAt.startsWith(today))
      .reduce((sum, o) => sum + o.total, 0)
  }

  const todayCount = () => {
    const today = new Date().toISOString().slice(0, 10)
    return orders.value.filter(
      (o) => o.status === 'completed' && o.createdAt.startsWith(today),
    ).length
  }

  return { orders, addOrder, todayTotal, todayCount }
})
