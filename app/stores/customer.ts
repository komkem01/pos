import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Customer } from '~/types/customer'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([
    { id: 1, name: 'สมชาย ใจดี', phone: '081-234-5678', points: 150, totalSpent: 1500, createdAt: '2024-01-01' },
    { id: 2, name: 'สมหญิง รักสวย', phone: '082-345-6789', points: 300, totalSpent: 3000, createdAt: '2024-01-01' },
  ])

  function findByPhone(phone: string) {
    return customers.value.find((c) => c.phone === phone) ?? null
  }

  function addPoints(customerId: number, amount: number) {
    const customer = customers.value.find((c) => c.id === customerId)
    if (customer) {
      customer.points += Math.floor(amount / 100)
      customer.totalSpent += amount
    }
  }

  return { customers, findByPhone, addPoints }
})
