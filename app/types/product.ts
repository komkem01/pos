export interface OptionChoice {
  id: string
  label: string
  priceExtra: number
}

export interface OptionGroup {
  id: string
  label: string
  type: 'radio' | 'checkbox'
  required: boolean
  choices: OptionChoice[]
}

export interface Category {
  id: number
  name: string
  color: string
  icon?: string
}

export interface Product {
  id: number
  name: string
  sku: string
  price: number
  cost: number
  stock: number
  categoryId: number
  category?: Category
  image?: string
  barcode?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  options?: OptionGroup[]
}
