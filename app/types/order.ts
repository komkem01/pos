export type PaymentMethod = 'cash' | 'card' | 'promptpay'
export type OrderStatus = 'completed' | 'cancelled' | 'refunded'

export interface OrderItem {
  productId: number
  productName: string
  price: number
  quantity: number
  discount: number
  subtotal: number
}

export interface Order {
  id: number
  orderNo: string
  items: OrderItem[]
  subtotal: number
  discountTotal: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  cashReceived?: number
  change?: number
  customerId?: number
  customerName?: string
  status: OrderStatus
  note?: string
  createdAt: string
}
