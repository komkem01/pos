<template>
  <div>
    <!-- ── Header ───────────────────────────────────────────────────────── -->
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-bold text-slate-800">จัดการสินค้า</h2>
        <p class="text-sm text-slate-500">สินค้าทั้งหมด {{ productStore.products.length }} รายการ</p>
      </div>
      <button
        class="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
        @click="openCreate"
      >
        <Icon name="heroicons:plus" class="h-4 w-4" />
        เพิ่มสินค้า
      </button>
    </div>

    <!-- ── Filter bar ───────────────────────────────────────────────────── -->
    <div class="mb-4 space-y-3">
      <!-- Search -->
      <div class="relative">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="productStore.search"
          placeholder="ค้นหาชื่อสินค้า หรือ SKU..."
          class="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          @keydown.enter="productStore.commitSearch()"
        />
      </div>
      <!-- Category chips – horizontal scroll, no wrap -->
      <div class="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          v-for="cat in productStore.categories"
          :key="cat.id"
          class="shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition"
          :class="productStore.selectedCategoryId === cat.id
            ? 'border-blue-600 bg-blue-600 text-white'
            : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600'"
          @click="productStore.selectedCategoryId = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- ── Table ────────────────────────────────────────────────────────── -->
    <UiCard padding="none">
      <div class="overflow-x-auto">
      <table class="w-full min-w-[600px] text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">สินค้า</th>
            <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 lg:table-cell">หมวดหมู่</th>
            <th class="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 md:table-cell">ราคาทุน</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">ราคาขาย</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">สต็อก</th>
            <th class="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 sm:table-cell">สถานะ</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="p in pagination.paged.value"
            :key="p.id"
            class="group hover:bg-blue-50/40"
          >
            <!-- Name + SKU -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                  <Icon name="heroicons:photo" class="h-5 w-5" />
                </div>
                <div>
                  <p class="font-semibold text-slate-800">{{ p.name }}</p>
                  <p class="text-xs text-slate-400">{{ p.sku }}</p>
                </div>
              </div>
            </td>
            <!-- Category -->
            <td class="hidden px-4 py-3 lg:table-cell">
              <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {{ productStore.categories.find(c => c.id === p.categoryId)?.name ?? '-' }}
              </span>
            </td>
            <!-- Cost -->
            <td class="hidden px-4 py-3 text-right tabular-nums text-slate-500 md:table-cell">{{ fmt.currency(p.cost) }}</td>
            <!-- Price -->
            <td class="px-4 py-3 text-right font-semibold tabular-nums text-slate-800">{{ fmt.currency(p.price) }}</td>
            <!-- Stock -->
            <td class="px-4 py-3 text-center">
              <span
                class="rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums"
                :class="p.stock === 0
                  ? 'bg-red-100 text-red-700'
                  : p.stock <= 5
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-700'"
              >
                {{ p.stock === 0 ? 'หมด' : p.stock <= 5 ? `เหลือ ${p.stock}` : p.stock }}
              </span>
            </td>
            <!-- Status -->
            <td class="hidden px-4 py-3 text-center sm:table-cell">
              <span
                class="rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ p.isActive ? 'ใช้งาน' : 'ปิดใช้งาน' }}
              </span>
            </td>
            <!-- Actions -->
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-1">
                <NuxtLink
                  :to="`/products/${p.id}`"
                  class="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                  title="ดูรายละเอียด"
                >
                  <Icon name="heroicons:eye" class="h-4 w-4" />
                </NuxtLink>
                <button
                  class="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                  title="แก้ไข"
                  @click="openEdit(p)"
                >
                  <Icon name="heroicons:pencil-square" class="h-4 w-4" />
                </button>
                <button
                  class="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  title="ลบ"
                  @click="confirmDelete(p)"
                >
                  <Icon name="heroicons:trash" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
          <!-- Empty state -->
          <tr v-if="pagination.paged.value.length === 0">
            <td colspan="7" class="py-12 text-center text-slate-400">
              <Icon name="heroicons:cube" class="mx-auto mb-2 h-10 w-10 opacity-30" />
              <p class="text-sm">ไม่พบสินค้า</p>
            </td>
          </tr>
        </tbody>
      </table>

      </div>
      <!-- Pagination -->
      <div class="border-t border-slate-100 px-5 py-4">
        <UiPaginate
          :current-page="pagination.currentPage.value"
          :total-pages="pagination.totalPages.value"
          :total-items="pagination.totalItems.value"
          :start-item="pagination.startItem.value"
          :end-item="pagination.endItem.value"
          :page-numbers="pagination.pageNumbers.value"
          @update:current-page="pagination.goTo"
        />
      </div>
    </UiCard>

    <!-- ── Create / Edit Modal ─────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="showModal = false"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
          <!-- Modal header -->
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 class="text-base font-bold text-slate-800">
              {{ form.id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}
            </h3>
            <button class="rounded-lg p-1 text-slate-400 hover:bg-slate-100" @click="showModal = false">
              <Icon name="heroicons:x-mark" class="h-5 w-5" />
            </button>
          </div>
          <!-- Modal body -->
          <div class="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <UiInput v-model="form.name" label="ชื่อสินค้า *" placeholder="เช่น ชาเย็น" :error="formErrors.name" />
              </div>
              <UiInput v-model="form.sku" label="SKU *" placeholder="เช่น DR003" :error="formErrors.sku" />
              <UiInput v-model="form.unit" label="หน่วย" placeholder="เช่น แก้ว, ชิ้น" />
              <div>
                <label class="mb-1 block text-xs font-semibold text-slate-600">หมวดหมู่</label>
                <select
                  v-model="form.categoryId"
                  class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option v-for="cat in productStore.categories.filter(c => c.id !== 0)" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <UiInput v-model="form.cost" type="decimal" label="ราคาทุน (฿)" prefix="฿" align="right" />
              <UiInput v-model="form.price" type="decimal" label="ราคาขาย (฿) *" prefix="฿" align="right" :error="formErrors.price" />
            </div>
          </div>
          <!-- Modal footer -->
          <div class="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              @click="showModal = false"
            >
              ยกเลิก
            </button>
            <button
              class="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              @click="saveProduct"
            >
              {{ form.id ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Delete Confirm Modal ─────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="deleteTarget = null"
      >
        <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-red-600" />
          </div>
          <h3 class="mb-1 text-base font-bold text-slate-800">ลบสินค้า</h3>
          <p class="mb-5 text-sm text-slate-500">
            ยืนยันการลบ <strong class="text-slate-700">{{ deleteTarget?.name }}</strong> ?
            การกระทำนี้ไม่สามารถย้อนกลับได้
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              @click="deleteTarget = null"
            >
              ยกเลิก
            </button>
            <button
              class="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700"
              @click="doDelete"
            >
              ลบเลย
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

definePageMeta({ layout: 'default' })

const productStore = useProductStore()
const fmt = useFormatter()
const toast = useToast()

// ── Pagination ───────────────────────────────────────────────────────────────
const pagination = usePagination(productStore.filtered, 10)

// ── Create / Edit modal ───────────────────────────────────────────────────────
const showModal = ref(false)
const formErrors = reactive<Record<string, string>>({})

const emptyForm = () => ({
  id: null as number | null,
  name: '',
  sku: '',
  unit: '',
  categoryId: 1,
  cost: 0,
  price: 0,
})

const form = reactive(emptyForm())

function openCreate() {
  Object.assign(form, emptyForm())
  Object.assign(formErrors, { name: '', sku: '', price: '' })
  showModal.value = true
}

function openEdit(p: Product) {
  Object.assign(form, {
    id: p.id,
    name: p.name,
    sku: p.sku,
    unit: (p as any).unit ?? '',
    categoryId: p.categoryId,
    cost: p.cost,
    price: p.price,
  })
  Object.assign(formErrors, { name: '', sku: '', price: '' })
  showModal.value = true
}

function saveProduct() {
  Object.assign(formErrors, { name: '', sku: '', price: '' })
  if (!form.name.trim()) { formErrors.name = 'กรุณากรอกชื่อสินค้า'; return }
  if (!form.sku.trim())  { formErrors.sku = 'กรุณากรอก SKU'; return }
  if (form.price <= 0)   { formErrors.price = 'ราคาขายต้องมากกว่า 0'; return }

  const isEdit = !!form.id
  if (form.id) {
    // Edit existing
    const idx = productStore.products.findIndex(p => p.id === form.id)
    const target = productStore.products[idx]
    if (idx !== -1 && target) {
      Object.assign(target, {
        name: form.name, sku: form.sku, categoryId: form.categoryId,
        cost: form.cost, price: form.price, updatedAt: new Date().toISOString(),
      })
    }
  } else {
    // Create new
    const newId = Math.max(...productStore.products.map(p => p.id)) + 1
    productStore.products.push({
      id: newId, name: form.name, sku: form.sku,
      categoryId: form.categoryId, cost: form.cost, price: form.price,
      stock: 0, isActive: true,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    } as Product)
  }
  showModal.value = false
  toast.success(isEdit ? 'แก้ไขสินค้าสำเร็จ' : 'เพิ่มสินค้าสำเร็จ')
}

// ── Delete ────────────────────────────────────────────────────────────────────
const deleteTarget = ref<Product | null>(null)

function confirmDelete(p: Product) {
  deleteTarget.value = p
}

function doDelete() {
  if (!deleteTarget.value) return
  const idx = productStore.products.findIndex(p => p.id === deleteTarget.value!.id)
  if (idx !== -1) productStore.products.splice(idx, 1)
  toast.success(`ลบ "${deleteTarget.value.name}" สำเร็จ`)
  deleteTarget.value = null
}
</script>
