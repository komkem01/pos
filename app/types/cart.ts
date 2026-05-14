import type { Product } from './product'

export interface SelectedOption {
  groupId: string
  groupLabel: string
  choiceIds: string[]
  choiceLabels: string[]
  totalExtra: number
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  discount: number
  note?: string
  selectedOptions: SelectedOption[]
  optionExtra: number
}
