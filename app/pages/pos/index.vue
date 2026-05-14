<template>
  <div class="flex h-screen select-none bg-slate-100">

    <!-- ===== LEFT: Products ===== -->
    <div class="flex flex-1 flex-col overflow-hidden">

      <!-- Topbar -->
      <div class="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4">
        <!-- Store name -->
        <div class="flex items-center gap-2 mr-1">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Icon name="heroicons:shopping-bag" class="h-4 w-4 text-white" />
          </div>
          <span class="text-sm font-semibold text-slate-700 hidden sm:block">{{ setting.storeName }}</span>
        </div>

        <!-- Search -->
        <div class="relative flex flex-1 items-center gap-2">
          <div class="relative flex-1">
            <Icon
              name="heroicons:magnifying-glass"
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              v-model="productStore.search"
              type="search"
              placeholder="ค้นหาสินค้า / บาร์โค้ด..."
              class="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              @keyup.enter="productStore.commitSearch()"
            />
          </div>
          <button
            class="flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 transition active:scale-95 shrink-0"
            @click="productStore.commitSearch()"
          >
            <Icon name="heroicons:magnifying-glass" class="h-3.5 w-3.5" />
            <span class="hidden sm:block">ค้นหา</span>
          </button>
        </div>

        <!-- Back office btn -->
        <NuxtLink
          to="/dashboard"
          class="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          <Icon name="heroicons:squares-2x2" class="h-4 w-4" />
          <span class="hidden sm:block">หลังบ้าน</span>
        </NuxtLink>

        <!-- Logout -->
        <button
          class="flex h-9 items-center gap-1.5 rounded-lg bg-red-50 px-3 text-xs font-medium text-red-500 hover:bg-red-100 transition active:scale-95"
          @click="showLogoutConfirm = true"
        >
          <Icon name="heroicons:arrow-right-on-rectangle" class="h-4 w-4" />
          <!-- <span class="hidden sm:block">ออกจากระบบ</span> -->
        </button>
      </div>

      <!-- Categories -->
      <div class="flex gap-2 overflow-x-auto bg-white border-b border-slate-200 px-4 py-2.5 scrollbar-none">
        <button
          v-for="cat in productStore.categories"
          :key="cat.id"
          :class="[
            'shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-95',
            productStore.selectedCategoryId === cat.id
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          ]"
          @click="productStore.selectedCategoryId = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Toolbar: page size + pagination -->
      <div class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 gap-3">
        <!-- Page size dropdown -->
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs text-slate-400 hidden sm:block">แสดง</span>
          <div class="relative">
            <select
              v-model="pageSize"
              class="h-8 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer hover:border-slate-300 transition"
            >
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
            <Icon
              name="heroicons:chevron-down"
              class="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400"
            />
          </div>
          <span class="text-xs text-slate-400 hidden sm:block">รายการ/หน้า</span>
        </div>

        <!-- Pagination controls -->
        <div class="flex items-center gap-1.5">
          <!-- Item range info -->
          <span class="text-xs text-slate-400 mr-1 tabular-nums">
            {{ pagination.startItem.value }}–{{ pagination.endItem.value }}
            <span class="text-slate-300 mx-0.5">/</span>
            <span class="font-medium text-slate-600">{{ pagination.totalItems.value }}</span>
          </span>

          <!-- Prev -->
          <button
            :disabled="pagination.currentPage.value <= 1"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            @click="pagination.prev()"
          >
            <Icon name="heroicons:chevron-left" class="h-3.5 w-3.5" />
          </button>

          <!-- Page numbers -->
          <template v-for="(page, i) in pagination.pageNumbers.value" :key="i">
            <span v-if="page === -1" class="flex w-5 items-center justify-center text-xs text-slate-300">…</span>
            <button
              v-else
              :class="[
                'flex h-7 w-7 items-center justify-center rounded-md border text-xs font-semibold shadow-sm transition active:scale-95',
                page === pagination.currentPage.value
                  ? 'border-blue-500 bg-blue-600 text-white shadow-blue-200'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
              ]"
              @click="pagination.goTo(page)"
            >
              {{ page }}
            </button>
          </template>

          <!-- Next -->
          <button
            :disabled="pagination.currentPage.value >= pagination.totalPages.value"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            @click="pagination.next()"
          >
            <Icon name="heroicons:chevron-right" class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <div class="flex-1 overflow-y-auto p-3">
          <div
            v-if="pagination.paged.value.length"
            class="grid grid-cols-3 gap-3 lg:grid-cols-4"
          >
            <PosProductCard
              v-for="product in pagination.paged.value"
              :key="product.id"
              :product="product"
              @add="handleProductAdd"
            />
          </div>
          <div v-else class="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <Icon name="heroicons:archive-box-x-mark" class="h-14 w-14" />
            <p class="text-sm">ไม่พบสินค้า</p>
          </div>
        </div>

        <!-- Pagination -->
        <div class="hidden">
        </div>
      </div>
    </div>

    <!-- ===== RIGHT: Cart ===== -->
    <div class="flex w-80 flex-col border-l border-slate-200 bg-slate-50 lg:w-96 xl:w-[420px]">

      <!-- Cart Header -->
      <div class="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5">
        <div class="flex items-center gap-2.5">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Icon name="heroicons:shopping-cart" class="h-4 w-4 text-white" />
          </div>
          <span class="font-bold text-slate-800">รายการสั่งซื้อ</span>
          <span
            v-if="cart.itemCount"
            class="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white"
          >
            {{ cart.itemCount }}
          </span>
        </div>
        <button
          v-if="cart.items.length"
          class="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
          @click="cart.clear"
        >
          <Icon name="heroicons:trash" class="h-3.5 w-3.5" />
          ล้างทั้งหมด
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto px-3 py-2">
        <div v-if="cart.items.length" class="space-y-2">
          <PosCartItem
            v-for="item in cart.items"
            :key="item.id"
            :item="item"
            @increase="cart.updateQuantity($event, getQtyById($event) + 1)"
            @decrease="cart.updateQuantity($event, getQtyById($event) - 1)"
            @remove="cart.removeItem"
          />
        </div>
        <div v-else class="flex h-full flex-col items-center justify-center gap-3 text-slate-300">
          <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <Icon name="heroicons:shopping-cart" class="h-10 w-10" />
          </div>
          <div class="text-center">
            <p class="text-sm font-medium text-slate-400">ยังไม่มีสินค้า</p>
            <p class="text-xs text-slate-300">กดสินค้าเพื่อเพิ่มลงตะกร้า</p>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="border-t border-slate-200 bg-white px-5 pt-4 pb-5 space-y-3">
        <!-- Row: ยอดรวม -->
        <div class="flex justify-between text-sm">
          <span class="text-slate-500">ยอดรวม</span>
          <span class="font-semibold text-slate-700">{{ fmt.currency(cart.subtotal) }}</span>
        </div>

        <!-- Row: ส่วนลด -->
        <div class="flex items-center justify-between gap-4 text-sm">
          <span class="shrink-0 text-slate-500">ส่วนลด (฿)</span>
          <UiInput
            v-model="cart.discountTotal"
            type="decimal"
            align="right"
            placeholder="0.00"
            class="w-28"
          />
        </div>

        <!-- Divider -->
        <div class="border-t border-dashed border-slate-200" />

        <!-- Total -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400">ยอดสุทธิ</p>
            <p class="text-2xl font-extrabold text-blue-600 leading-tight">{{ fmt.currency(cart.total) }}</p>
          </div>
          <div class="text-right text-xs text-slate-400">
            <p>{{ cart.itemCount }} รายการ</p>
          </div>
        </div>

        <!-- Checkout button -->
        <button
          :disabled="!cart.items.length"
          class="w-full rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
          @click="showPayment = true"
        >
          <span class="flex items-center justify-center gap-2">
            <Icon name="heroicons:banknotes" class="h-5 w-5" />
            ชำระเงิน
          </span>
        </button>
      </div>
    </div>

    <!-- Product Option Modal -->
    <PosProductOptionModal
      :show="showOptionModal"
      :product="selectedProduct"
      @close="showOptionModal = false"
      @confirm="handleOptionConfirm"
    />

    <!-- Payment Modal -->
    <PosPaymentModal
      :show="showPayment"
      :total="cart.total"
      @close="showPayment = false"
      @confirm="handlePayment"
    />

    <!-- Logout Confirm -->
    <UiConfirmModal
      :show="showLogoutConfirm"
      title="ออกจากระบบ?"
      description="รายการในตะกร้าที่ยังไม่ได้ชำระเงินจะถูกยกเลิก"
      icon="heroicons:arrow-right-on-rectangle"
      confirm-label="ออกจากระบบ"
      cancel-label="ยกเลิก"
      @confirm="handleLogout"
      @cancel="showLogoutConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { PaymentMethod } from '~/types/order'
import type { Product } from '~/types/product'
import type { SelectedOption } from '~/types/cart'

definePageMeta({ layout: 'pos' })

const cart = useCartStore()
const productStore = useProductStore()
const orderStore = useOrderStore()
const setting = useSettingStore()
const auth = useAuthStore()
const toast = useToast()

const fmt = useFormatter()

async function handleLogout() {
  showLogoutConfirm.value = false
  auth.logout()
  await navigateTo('/login')
}

const showPayment = ref(false)
const showLogoutConfirm = ref(false)
const showOptionModal = ref(false)
const selectedProduct = ref<Product | null>(null)

const pageSizeOptions = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const
const pageSize = ref<number>(10)
const pagination = usePagination(computed(() => productStore.filtered), pageSize)

function getQtyById(itemId: string) {
  return cart.items.find((i) => i.id === itemId)?.quantity ?? 0
}

function handleProductAdd(product: Product) {
  if (product.options?.length) {
    selectedProduct.value = product
    showOptionModal.value = true
  } else {
    cart.addItem(product)
  }
}

function handleOptionConfirm(selectedOptions: SelectedOption[], optionExtra: number, qty: number) {
  if (selectedProduct.value) {
    cart.addItem(selectedProduct.value, selectedOptions, optionExtra, qty)
  }
  showOptionModal.value = false
  selectedProduct.value = null
}

function handlePayment(payload: {
  method: PaymentMethod
  cashReceived?: number
  change?: number
}) {
  orderStore.addOrder({
    items: cart.items.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      discount: i.discount,
      subtotal: i.product.price * i.quantity,
    })),
    subtotal: cart.subtotal,
    discountTotal: cart.discountTotal,
    tax: 0,
    total: cart.total,
    paymentMethod: payload.method,
    cashReceived: payload.cashReceived,
    change: payload.change,
    status: 'completed',
  })

  cart.clear()
  showPayment.value = false
  toast.success('ชำระเงินสำเร็จ')
}
</script>
