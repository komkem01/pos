import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, Category, OptionGroup } from '~/types/product'

const DRINK_OPTIONS: OptionGroup[] = [
  {
    id: 'temperature',
    label: 'ประเภท',
    type: 'radio',
    required: true,
    choices: [
      { id: 'hot', label: 'ร้อน', priceExtra: 0 },
      { id: 'cold', label: 'เย็น', priceExtra: 0 },
      { id: 'blended', label: 'ปั่น', priceExtra: 10 },
    ],
  },
  {
    id: 'sweetness',
    label: 'ความหวาน',
    type: 'radio',
    required: true,
    choices: [
      { id: 'no_sugar', label: 'ไม่หวาน', priceExtra: 0 },
      { id: 'less', label: 'หวานน้อย', priceExtra: 0 },
      { id: 'normal', label: 'หวานปกติ', priceExtra: 0 },
      { id: 'extra', label: 'หวานมาก', priceExtra: 0 },
    ],
  },
  {
    id: 'toppings',
    label: 'ท็อปปิ้ง',
    type: 'checkbox',
    required: false,
    choices: [
      { id: 'pearl', label: 'ไข่มุก', priceExtra: 10 },
      { id: 'jelly', label: 'วุ้น', priceExtra: 5 },
      { id: 'taro', label: 'เผือก', priceExtra: 10 },
      { id: 'coconut_jelly', label: 'วุ้นมะพร้าว', priceExtra: 5 },
    ],
  },
]

const DESSERT_OPTIONS: OptionGroup[] = [
  {
    id: 'size',
    label: 'ขนาด',
    type: 'radio',
    required: true,
    choices: [
      { id: 'small', label: 'เล็ก', priceExtra: 0 },
      { id: 'medium', label: 'กลาง', priceExtra: 15 },
      { id: 'large', label: 'ใหญ่', priceExtra: 30 },
    ],
  },
  {
    id: 'toppings',
    label: 'ท็อปปิ้ง',
    type: 'checkbox',
    required: false,
    choices: [
      { id: 'choco_sauce', label: 'ซอสช็อก', priceExtra: 10 },
      { id: 'whipped_cream', label: 'วิปครีม', priceExtra: 10 },
      { id: 'sprinkles', label: 'สปริงเกิล', priceExtra: 5 },
    ],
  },
]

export const useProductStore = defineStore('product', () => {
  const categories = ref<Category[]>([
    { id: 0, name: 'ทั้งหมด', color: 'gray' },
    { id: 1, name: 'อาหาร', color: 'orange', icon: 'heroicons:fire' },
    { id: 2, name: 'เครื่องดื่ม', color: 'blue', icon: 'heroicons:beaker' },
    { id: 3, name: 'ของหวาน', color: 'pink', icon: 'heroicons:cake' },
    { id: 4, name: 'อื่นๆ', color: 'gray', icon: 'heroicons:squares-2x2' },
  ])

  const products = ref<Product[]>([
    { id: 1, name: 'ข้าวผัดกุ้ง', sku: 'FD001', price: 80, cost: 40, stock: 99, categoryId: 1, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 2, name: 'ผัดไทย', sku: 'FD002', price: 70, cost: 35, stock: 99, categoryId: 1, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 3, name: 'ต้มยำกุ้ง', sku: 'FD003', price: 120, cost: 60, stock: 99, categoryId: 1, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 4, name: 'ส้มตำ', sku: 'FD004', price: 60, cost: 25, stock: 99, categoryId: 1, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 5, name: 'น้ำเปล่า', sku: 'DR001', price: 15, cost: 5, stock: 50, categoryId: 2, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 6, name: 'โค้ก', sku: 'DR002', price: 25, cost: 12, stock: 40, categoryId: 2, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 7, name: 'ชาเย็น', sku: 'DR003', price: 35, cost: 15, stock: 40, categoryId: 2, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', options: DRINK_OPTIONS },
    { id: 8, name: 'กาแฟเย็น', sku: 'DR004', price: 45, cost: 18, stock: 40, categoryId: 2, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', options: DRINK_OPTIONS },
    { id: 9, name: 'ไอศกรีม', sku: 'DT001', price: 40, cost: 15, stock: 30, categoryId: 3, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', options: DESSERT_OPTIONS },
    { id: 10, name: 'เค้กช็อกโกแลต', sku: 'DT002', price: 60, cost: 25, stock: 20, categoryId: 3, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', options: DESSERT_OPTIONS },
    { id: 11, name: 'บราวนี่', sku: 'DT003', price: 45, cost: 18, stock: 25, categoryId: 3, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', options: DESSERT_OPTIONS },
  ])

  /** live input value (v-model ใน input) */
  const search = ref('')
  /** ค่าที่ใช้กรองจริง — อัพเดตเมื่อกดปุ่มค้นหาหรือ Enter */
  const committedSearch = ref('')
  const selectedCategoryId = ref(0)

  function commitSearch() {
    committedSearch.value = search.value
  }

  const filtered = computed(() =>
    products.value.filter((p) => {
      const matchCategory = selectedCategoryId.value === 0 || p.categoryId === selectedCategoryId.value
      const matchSearch =
        !committedSearch.value ||
        p.name.toLowerCase().includes(committedSearch.value.toLowerCase()) ||
        p.sku.includes(committedSearch.value)
      return matchCategory && matchSearch && p.isActive
    }),
  )

  return { categories, products, search, committedSearch, selectedCategoryId, filtered, commitSearch }
})
