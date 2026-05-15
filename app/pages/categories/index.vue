<template>
  <div>
    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-800">ประเภทสินค้า</h2>
        <p class="text-sm text-slate-500">จัดการหมวดหมู่สำหรับแบ่งกลุ่มสินค้า</p>
      </div>
      <button
        class="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
        @click="openCreate"
      >
        <Icon name="heroicons:plus" class="h-4 w-4" />
        เพิ่มประเภท
      </button>
    </div>

    <!-- ── Category Grid ──────────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
      >
        <!-- Icon -->
        <div
          class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
          :class="cat.bgColor"
        >
          <Icon :name="cat.icon" class="h-6 w-6" :class="cat.iconColor" />
        </div>
        <!-- Info -->
        <p class="font-semibold text-slate-800">{{ cat.name }}</p>
        <p class="mt-0.5 text-xs text-slate-400">{{ cat.count }} รายการ</p>
        <!-- Hover actions -->
        <div class="absolute right-3 top-3 flex gap-1">
          <button
            class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
            title="แก้ไข"
            @click="openEdit(cat)"
          >
            <Icon name="heroicons:pencil-square" class="h-3.5 w-3.5" />
          </button>
          <button
            class="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
            title="ลบ"
            @click="confirmDelete(cat)"
          >
            <Icon name="heroicons:trash" class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <!-- Add placeholder button -->
      <button
        class="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-5 text-slate-400 transition hover:border-blue-300 hover:text-blue-500"
        @click="openCreate"
      >
        <Icon name="heroicons:plus-circle" class="h-8 w-8" />
        <span class="text-xs font-medium">เพิ่มประเภท</span>
      </button>
    </div>

    <!-- ── Add / Edit Modal ───────────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="showModal = false"
      >
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 class="text-base font-bold text-slate-800">
              {{ form.id ? 'แก้ไขประเภทสินค้า' : 'เพิ่มประเภทสินค้า' }}
            </h3>
            <button class="rounded-lg p-1 text-slate-400 hover:bg-slate-100" @click="showModal = false">
              <Icon name="heroicons:x-mark" class="h-5 w-5" />
            </button>
          </div>
          <!-- Body -->
          <div class="space-y-4 px-6 py-5">
            <UiInput v-model="form.name" label="ชื่อประเภท (ภาษาไทย) *" placeholder="เช่น เครื่องดื่ม" :error="formErrors.name" />
            <UiInput v-model="form.nameEn" label="ชื่อประเภท (ภาษาอังกฤษ)" placeholder="e.g. Beverage" />
            <!-- Icon picker -->
            <div>
              <label class="mb-2 block text-xs font-semibold text-slate-600">ไอคอน</label>
              <div class="grid grid-cols-6 gap-2">
                <button
                  v-for="ic in iconOptions"
                  :key="ic.value"
                  class="flex items-center justify-center rounded-xl border p-2.5 transition"
                  :class="form.icon === ic.value
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'"
                  @click="form.icon = ic.value"
                >
                  <Icon :name="ic.value" class="h-5 w-5" />
                </button>
              </div>
            </div>
            <!-- Color picker -->
            <div>
              <label class="mb-2 block text-xs font-semibold text-slate-600">สี</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="c in colorOptions"
                  :key="c.value"
                  class="h-8 w-8 rounded-full border-2 transition"
                  :class="[c.bg, form.color === c.value ? 'border-slate-700 scale-110' : 'border-transparent hover:scale-105']"
                  :title="c.label"
                  @click="selectColor(c)"
                />
              </div>
            </div>
            <!-- Preview -->
            <div class="rounded-xl bg-slate-50 p-3">
              <p class="mb-2 text-xs text-slate-400">ตัวอย่าง</p>
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl" :class="form.bgColor">
                  <Icon :name="form.icon" class="h-5 w-5" :class="form.iconColor" />
                </div>
                <p class="font-semibold text-slate-700">{{ form.name || 'ชื่อประเภท' }}</p>
              </div>
            </div>

          </div>
          <!-- Footer -->
          <div class="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" @click="showModal = false">ยกเลิก</button>
            <button class="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700" @click="saveCategory">บันทึก</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Delete Confirm ─────────────────────────────────────────────────── -->
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
          <h3 class="mb-1 text-base font-bold text-slate-800">ลบประเภทสินค้า</h3>
          <p class="mb-5 text-sm text-slate-500">
            ยืนยันการลบ <strong class="text-slate-700">{{ deleteTarget?.name }}</strong>?
            สินค้าที่อยู่ในหมวดหมู่นี้จะต้องอัพเดตหมวดหมู่ใหม่
          </p>
          <div class="flex gap-3">
            <button class="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" @click="deleteTarget = null">ยกเลิก</button>
            <button class="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700" @click="doDelete">ลบเลย</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const toast = useToast()

// ── Mock data ─────────────────────────────────────────────────────────────────
interface CategoryItem {
  id: number; name: string; nameEn?: string; count: number
  icon: string; bgColor: string; iconColor: string; color: string
}

const categories = ref<CategoryItem[]>([
  { id: 1, name: 'เครื่องดื่ม',       nameEn: 'Beverage',  count: 12, icon: 'heroicons:beaker',      color: 'blue',   bgColor: 'bg-blue-100',   iconColor: 'text-blue-600' },
  { id: 2, name: 'ของหวาน',           nameEn: 'Dessert',   count: 8,  icon: 'heroicons:cake',        color: 'pink',   bgColor: 'bg-pink-100',   iconColor: 'text-pink-600' },
  { id: 3, name: 'อาหาร',             nameEn: 'Food',      count: 15, icon: 'heroicons:fire',        color: 'orange', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { id: 4, name: 'ของทานเล่น',        nameEn: 'Snack',     count: 6,  icon: 'heroicons:star',        color: 'yellow', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { id: 5, name: 'สินค้าบรรจุภัณฑ์', nameEn: 'Packaging', count: 4,  icon: 'heroicons:cube',        color: 'purple', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
])

// ── Icon options ──────────────────────────────────────────────────────────────
const iconOptions = [
  { value: 'heroicons:beaker' },
  { value: 'heroicons:cake' },
  { value: 'heroicons:fire' },
  { value: 'heroicons:star' },
  { value: 'heroicons:cube' },
  { value: 'heroicons:heart' },
  { value: 'heroicons:bolt' },
  { value: 'heroicons:gift' },
  { value: 'heroicons:shopping-bag' },
  { value: 'heroicons:sparkles' },
  { value: 'heroicons:sun' },
  { value: 'heroicons:tag' },
]

// ── Color options ─────────────────────────────────────────────────────────────
const colorOptions = [
  { value: 'blue',   label: 'น้ำเงิน',  bg: 'bg-blue-500',   bgColor: 'bg-blue-100',   iconColor: 'text-blue-600' },
  { value: 'pink',   label: 'ชมพู',     bg: 'bg-pink-500',   bgColor: 'bg-pink-100',   iconColor: 'text-pink-600' },
  { value: 'orange', label: 'ส้ม',      bg: 'bg-orange-500', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { value: 'yellow', label: 'เหลือง',  bg: 'bg-yellow-500', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { value: 'purple', label: 'ม่วง',    bg: 'bg-purple-500', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { value: 'green',  label: 'เขียว',   bg: 'bg-emerald-500', bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { value: 'red',    label: 'แดง',      bg: 'bg-red-500',    bgColor: 'bg-red-100',    iconColor: 'text-red-600' },
  { value: 'teal',   label: 'เขียวน้ำ', bg: 'bg-teal-500',  bgColor: 'bg-teal-100',   iconColor: 'text-teal-600' },
]

// ── Form ──────────────────────────────────────────────────────────────────────
const showModal = ref(false)
const formErrors = reactive<Record<string, string>>({})

const emptyForm = () => ({
  id: null as number | null,
  name: '', nameEn: '',
  icon: 'heroicons:tag',
  color: 'blue',
  bgColor: 'bg-blue-100',
  iconColor: 'text-blue-600',
})

const form = reactive(emptyForm())

function selectColor(c: typeof colorOptions[number]) {
  form.color     = c.value
  form.bgColor   = c.bgColor
  form.iconColor = c.iconColor
}

function openCreate() {
  Object.assign(form, emptyForm())
  Object.assign(formErrors, { name: '' })
  showModal.value = true
}

function openEdit(cat: CategoryItem) {
  Object.assign(form, {
    id: cat.id, name: cat.name, nameEn: cat.nameEn ?? '',
    icon: cat.icon, color: cat.color,
    bgColor: cat.bgColor, iconColor: cat.iconColor,
  })
  Object.assign(formErrors, { name: '' })
  showModal.value = true
}

function saveCategory() {
  Object.assign(formErrors, { name: '' })
  if (!form.name.trim()) { formErrors.name = 'กรุณากรอกชื่อประเภทสินค้า'; return }

  const isEdit = !!form.id
  if (form.id) {
    const idx = categories.value.findIndex(c => c.id === form.id)
    const target = categories.value[idx]
    if (idx !== -1 && target) {
      Object.assign(target, {
        name: form.name, nameEn: form.nameEn,
        icon: form.icon, color: form.color,
        bgColor: form.bgColor, iconColor: form.iconColor,
      })
    }
  } else {
    const newId = Math.max(...categories.value.map(c => c.id)) + 1
    categories.value.push({
      id: newId, name: form.name, nameEn: form.nameEn,
      count: 0, icon: form.icon, color: form.color,
      bgColor: form.bgColor, iconColor: form.iconColor,
    })
  }
  showModal.value = false
  toast.success(isEdit ? 'แก้ไขประเภทสินค้าสำเร็จ' : 'เพิ่มประเภทสินค้าสำเร็จ')
}

// ── Delete ────────────────────────────────────────────────────────────────────
const deleteTarget = ref<CategoryItem | null>(null)

function confirmDelete(cat: CategoryItem) {
  deleteTarget.value = cat
}

function doDelete() {
  if (!deleteTarget.value) return
  const idx = categories.value.findIndex(c => c.id === deleteTarget.value!.id)
  if (idx !== -1) categories.value.splice(idx, 1)
  toast.success(`ลบ "${deleteTarget.value.name}" สำเร็จ`)
  deleteTarget.value = null
}
</script>
