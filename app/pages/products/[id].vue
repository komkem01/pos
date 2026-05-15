<template>
  <div>
    <!-- ── Back + Header ──────────────────────────────────────────────────── -->
    <div class="mb-6">
      <NuxtLink
        to="/products"
        class="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <Icon name="heroicons:arrow-left" class="h-4 w-4" />
        กลับรายการสินค้า
      </NuxtLink>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold text-slate-800">
            {{ product?.name ?? "ไม่พบสินค้า" }}
          </h2>
          <span
            class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-mono font-semibold text-slate-500"
          >
            {{ product?.sku }}
          </span>
          <span
            class="rounded-full px-2.5 py-0.5 text-xs font-medium"
            :class="
              product?.isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            "
          >
            {{ product?.isActive ? "ใช้งาน" : "ปิดใช้งาน" }}
          </span>
        </div>
        <div class="flex gap-2">
          <button
            class="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            @click="printBarcode"
          >
            <Icon name="heroicons:qr-code" class="h-4 w-4" />
            พิมพ์บาร์โค้ด
          </button>
          <button
            class="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            @click="showDeleteConfirm = true"
          >
            <Icon name="heroicons:trash" class="h-4 w-4" />
            ลบสินค้า
          </button>
          <button
            class="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            @click="saveProduct"
          >
            <Icon name="heroicons:check" class="h-4 w-4" />
            บันทึก
          </button>
        </div>
      </div>
    </div>

    <!-- Not found -->
    <div v-if="!product" class="py-20 text-center text-slate-400">
      <Icon name="heroicons:cube" class="mx-auto mb-3 h-14 w-14 opacity-30" />
      <p class="font-medium">ไม่พบสินค้า</p>
      <NuxtLink
        to="/products"
        class="mt-3 inline-block text-sm text-blue-600 hover:underline"
        >กลับรายการสินค้า</NuxtLink
      >
    </div>

    <template v-else>
      <!-- ── Tab navigation ─────────────────────────────────────────────── -->
      <div class="mb-5 flex gap-1 border-b border-slate-200">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="flex items-center gap-1.5 border-b-2 px-4 pb-3 pt-1 text-sm font-medium transition"
          :class="
            activeTab === tab.key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          "
          @click="activeTab = tab.key"
        >
          <Icon :name="tab.icon" class="h-4 w-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- ── Tab 1: ทั่วไป ──────────────────────────────────────────────── -->
      <div v-show="activeTab === 'general'">
        <div class="grid grid-cols-3 gap-5">
          <!-- Image upload placeholder -->
          <div class="col-span-1">
            <UiCard title="รูปภาพสินค้า">
              <div
                class="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 py-10 text-slate-400 hover:border-blue-300 hover:text-blue-400 transition cursor-pointer"
              >
                <Icon name="heroicons:photo" class="h-12 w-12" />
                <p class="text-sm font-medium">อัปโหลดรูปภาพ</p>
                <p class="text-xs">PNG, JPG ขนาดไม่เกิน 2MB</p>
              </div>
            </UiCard>
          </div>

          <!-- Fields -->
          <div class="col-span-2 space-y-4">
            <UiCard title="ข้อมูลทั่วไป">
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="mb-1 block text-xs font-semibold text-slate-600"
                    >ชื่อสินค้า (ภาษาไทย)
                    <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="form.name"
                    class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div class="col-span-2">
                  <label class="mb-1 block text-xs font-semibold text-slate-600"
                    >ชื่อสินค้า (ภาษาอังกฤษ)</label
                  >
                  <input
                    v-model="form.nameEn"
                    placeholder="Optional"
                    class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-slate-600"
                    >หมวดหมู่</label
                  >
                  <select
                    v-model="form.categoryId"
                    class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option
                      v-for="cat in productStore.categories.filter(
                        (c) => c.id !== 0,
                      )"
                      :key="cat.id"
                      :value="cat.id"
                    >
                      {{ cat.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-slate-600"
                    >หน่วยนับ (UoM)</label
                  >
                  <input
                    v-model="form.unit"
                    placeholder="เช่น แก้ว, ชิ้น, กิโล"
                    class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-slate-600"
                    >SKU</label
                  >
                  <input
                    v-model="form.sku"
                    class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-slate-600"
                    >บาร์โค้ด</label
                  >
                  <input
                    v-model="form.barcode"
                    placeholder="เช่น 8850006100086"
                    class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div class="col-span-2">
                  <label class="mb-1 block text-xs font-semibold text-slate-600"
                    >หมายเหตุ</label
                  >
                  <textarea
                    v-model="form.notes"
                    rows="2"
                    placeholder="หมายเหตุภายใน..."
                    class="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </UiCard>
          </div>
        </div>
      </div>

      <!-- ── Tab 2: ราคา & สต็อก ────────────────────────────────────────── -->
      <div v-show="activeTab === 'pricing'">
        <div class="grid grid-cols-2 gap-5">
          <!-- Pricing -->
          <UiCard title="ราคาและภาษี">
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-xs font-semibold text-slate-600"
                  >ราคาทุน (Cost Price)</label
                >
                <div class="relative">
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"
                    >฿</span
                  >
                  <input
                    v-model.number="form.cost"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-xl border border-slate-200 py-2.5 pl-8 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div>
                <label class="mb-1 block text-xs font-semibold text-slate-600"
                  >ราคาขาย (Selling Price)
                  <span class="text-red-500">*</span></label
                >
                <div class="relative">
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"
                    >฿</span
                  >
                  <input
                    v-model.number="form.price"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-xl border border-slate-200 py-2.5 pl-8 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <!-- Profit preview -->
              <div class="rounded-xl bg-slate-50 p-3 text-sm">
                <div class="flex justify-between text-slate-500">
                  <span>กำไรต่อหน่วย</span>
                  <span
                    class="font-semibold"
                    :class="
                      form.price - form.cost >= 0
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    "
                  >
                    {{ fmt.currency(form.price - form.cost) }}
                  </span>
                </div>
                <div class="flex justify-between text-slate-500 mt-1">
                  <span>อัตรากำไร</span>
                  <span class="font-semibold text-slate-700">
                    {{
                      form.price > 0
                        ? (
                            ((form.price - form.cost) / form.price) *
                            100
                          ).toFixed(1)
                        : 0
                    }}%
                  </span>
                </div>
              </div>
              <!-- VAT Status -->
              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600"
                  >สถานะภาษี (VAT)</label
                >
                <div class="flex flex-col gap-2">
                  <label
                    v-for="opt in taxOptions"
                    :key="opt.value"
                    class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition"
                    :class="
                      form.taxStatus === opt.value
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    "
                  >
                    <input
                      v-model="form.taxStatus"
                      type="radio"
                      :value="opt.value"
                      class="text-blue-600"
                    />
                    <div>
                      <p class="text-sm font-medium text-slate-700">
                        {{ opt.label }}
                      </p>
                      <p class="text-xs text-slate-400">{{ opt.desc }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </UiCard>

          <!-- Inventory -->
          <UiCard title="การจัดการสต็อก">
            <div class="space-y-4">
              <!-- Track inventory toggle -->
              <div
                class="flex items-center justify-between rounded-xl border border-slate-200 p-4"
              >
                <div>
                  <p class="text-sm font-semibold text-slate-700">
                    ติดตามสต็อก (Track Inventory)
                  </p>
                  <p class="text-xs text-slate-400">
                    ปิดสำหรับสินค้าบริการที่ไม่ต้องตัดสต็อก
                  </p>
                </div>
                <button
                  class="relative h-6 w-11 rounded-full transition"
                  :class="form.trackInventory ? 'bg-blue-600' : 'bg-slate-200'"
                  @click="form.trackInventory = !form.trackInventory"
                >
                  <span
                    class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                    :class="form.trackInventory ? 'left-5' : 'left-0.5'"
                  />
                </button>
              </div>

              <template v-if="form.trackInventory">
                <div>
                  <label class="mb-1 block text-xs font-semibold text-slate-600"
                    >จำนวนคงเหลือ (Stock on Hand)</label
                  >
                  <input
                    v-model.number="form.stock"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-slate-600"
                    >จุดสั่งซื้อ (Low Stock Alert)</label
                  >
                  <input
                    v-model.number="form.minStock"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  <p class="mt-1 text-xs text-slate-400">
                    ระบบจะแจ้งเตือนเมื่อสต็อกต่ำกว่าจำนวนนี้
                  </p>
                </div>
                <!-- Stock status badge preview -->
                <div class="rounded-xl bg-slate-50 p-3">
                  <p class="text-xs text-slate-500">สถานะสต็อกปัจจุบัน</p>
                  <span
                    class="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    :class="stockStatusClass"
                  >
                    {{ stockStatusLabel }}
                  </span>
                </div>
              </template>
              <div
                v-else
                class="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400"
              >
                ไม่ติดตามสต็อก (สินค้าบริการ)
              </div>
            </div>
          </UiCard>
        </div>
      </div>

      <!-- ── Tab 3: ตัวเลือก ────────────────────────────────────────────── -->
      <div v-show="activeTab === 'options'">
        <div class="grid grid-cols-2 gap-5">
          <!-- Variants -->
          <UiCard title="ตัวเลือกสินค้า (Variants)">
            <template #header>
              <button
                class="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                @click="showAddVariant = true"
              >
                <Icon name="heroicons:plus" class="h-3.5 w-3.5" />
                เพิ่ม
              </button>
            </template>

            <div
              v-if="product.options && product.options.length > 0"
              class="space-y-2"
            >
              <div
                v-for="opt in product.options"
                :key="opt.id"
                class="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p class="text-sm font-semibold text-slate-700">
                    {{ opt.label }}
                  </p>
                  <p class="text-xs text-slate-400">
                    {{
                      opt.type === "radio"
                        ? "เลือกได้ 1 อย่าง"
                        : "เลือกได้หลายอย่าง"
                    }}
                    · {{ opt.choices.length }} ตัวเลือก
                  </p>
                  <div class="mt-1.5 flex flex-wrap gap-1">
                    <span
                      v-for="ch in opt.choices"
                      :key="ch.id"
                      class="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-600"
                    >
                      {{ ch.label
                      }}<span v-if="ch.priceExtra > 0" class="text-emerald-600">
                        +{{ ch.priceExtra }}</span
                      >
                    </span>
                  </div>
                </div>
                <div class="flex gap-1">
                  <button
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                  >
                    <Icon name="heroicons:pencil-square" class="h-4 w-4" />
                  </button>
                  <button
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Icon name="heroicons:trash" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="py-8 text-center text-sm text-slate-400">
              ยังไม่มีตัวเลือก · กด "เพิ่ม" เพื่อเพิ่มขนาด, สี, ฯลฯ
            </div>
          </UiCard>

          <!-- Add-ons / Toppings -->
          <UiCard title="ท็อปปิ้ง / ส่วนเสริม (Add-ons)">
            <template #header>
              <button
                class="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                @click="showAddAddon = true"
              >
                <Icon name="heroicons:plus" class="h-3.5 w-3.5" />
                เพิ่ม
              </button>
            </template>

            <div v-if="addons.length > 0" class="space-y-2">
              <div
                v-for="addon in addons"
                :key="addon.id"
                class="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p class="text-sm font-semibold text-slate-700">
                    {{ addon.name }}
                  </p>
                  <p class="text-xs text-emerald-600 font-medium">
                    +{{ fmt.currency(addon.priceExtra) }}
                  </p>
                </div>
                <div class="flex gap-1">
                  <button
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                  >
                    <Icon name="heroicons:pencil-square" class="h-4 w-4" />
                  </button>
                  <button
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    @click="removeAddon(addon.id)"
                  >
                    <Icon name="heroicons:trash" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="py-8 text-center text-sm text-slate-400">
              ยังไม่มีส่วนเสริม · กด "เพิ่ม" เพื่อเพิ่มท็อปปิ้ง
            </div>
          </UiCard>
        </div>
      </div>
    </template>

    <!-- ── Add Addon Modal ────────────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="showAddAddon"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="showAddAddon = false"
      >
        <div class="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
          <div
            class="flex items-center justify-between border-b border-slate-100 px-6 py-4"
          >
            <h3 class="text-base font-bold text-slate-800">
              เพิ่มท็อปปิ้ง / ส่วนเสริม
            </h3>
            <button
              class="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              @click="showAddAddon = false"
            >
              <Icon name="heroicons:x-mark" class="h-5 w-5" />
            </button>
          </div>
          <div class="space-y-4 px-6 py-5">
            <div>
              <label class="mb-1 block text-xs font-semibold text-slate-600"
                >ชื่อ <span class="text-red-500">*</span></label
              >
              <input
                v-model="addonForm.name"
                placeholder="เช่น ไข่มุก, วิปครีม"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-slate-600"
                >ราคาเพิ่ม (฿)</label
              >
              <input
                v-model.number="addonForm.priceExtra"
                type="number"
                min="0"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div
            class="flex justify-end gap-3 border-t border-slate-100 px-6 py-4"
          >
            <button
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              @click="showAddAddon = false"
            >
              ยกเลิก
            </button>
            <button
              class="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              @click="saveAddon"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Delete Confirm ────────────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="showDeleteConfirm = false"
      >
        <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
          <div
            class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
          >
            <Icon
              name="heroicons:exclamation-triangle"
              class="h-6 w-6 text-red-600"
            />
          </div>
          <h3 class="mb-1 text-base font-bold text-slate-800">ลบสินค้า</h3>
          <p class="mb-5 text-sm text-slate-500">
            ยืนยันการลบ <strong>{{ product?.name }}</strong
            >?
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              @click="showDeleteConfirm = false"
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
import type { Product } from "~/types/product";

definePageMeta({ layout: "default" });

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const fmt = useFormatter();
const toast = useToast();

const productId = computed(() => Number(route.params.id));
const product = computed(
  () => productStore.products.find((p) => p.id === productId.value) ?? null,
);

// ── Tabs ──────────────────────────────────────────────────────────────────────
const activeTab = ref<"general" | "pricing" | "options">("general");

const tabs = [
  { key: "general", label: "ทั่วไป", icon: "heroicons:information-circle" },
  { key: "pricing", label: "ราคา & สต็อก", icon: "heroicons:banknotes" },
  { key: "options", label: "ตัวเลือก", icon: "heroicons:squares-plus" },
] as const;

// ── Form ──────────────────────────────────────────────────────────────────────
const form = reactive({
  name: "",
  nameEn: "",
  sku: "",
  barcode: "",
  unit: "",
  categoryId: 1,
  cost: 0,
  price: 0,
  taxStatus: "no_vat" as "include_vat" | "exclude_vat" | "no_vat",
  trackInventory: false,
  stock: 0,
  minStock: 0,
  notes: "",
});

const taxOptions = [
  {
    value: "no_vat",
    label: "ไม่มี VAT",
    desc: "ราคานี้ยังไม่รวม/ไม่เกี่ยวกับภาษี",
  },
  {
    value: "include_vat",
    label: "รวม VAT แล้ว",
    desc: "ราคาขายรวมภาษีมูลค่าเพิ่ม 7% ไว้แล้ว",
  },
  {
    value: "exclude_vat",
    label: "ยังไม่รวม VAT",
    desc: "ระบบจะบวก VAT 7% เพิ่มในใบเสร็จ",
  },
];

// Populate form when product loads
watch(
  product,
  (p) => {
    if (!p) return;
    Object.assign(form, {
      name: p.name,
      nameEn: (p as any).nameEn ?? "",
      sku: p.sku,
      barcode: (p as any).barcode ?? "",
      unit: (p as any).unit ?? "",
      categoryId: p.categoryId,
      cost: p.cost,
      price: p.price,
      taxStatus: (p as any).taxStatus ?? "no_vat",
      trackInventory: (p as any).trackInventory ?? false,
      stock: p.stock,
      minStock: (p as any).minStockLevel ?? 0,
      notes: (p as any).notes ?? "",
    });
  },
  { immediate: true },
);

// ── Stock status ──────────────────────────────────────────────────────────────
const stockStatusClass = computed(() => {
  if (form.stock === 0) return "bg-red-100 text-red-700";
  if (form.stock <= form.minStock) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
});
const stockStatusLabel = computed(() => {
  if (form.stock === 0) return "หมดสต็อก";
  if (form.stock <= form.minStock) return `ใกล้หมด (${form.stock} ชิ้น)`;
  return `ปกติ (${form.stock} ชิ้น)`;
});

// ── Add-ons (local mock) ───────────────────────────────────────────────────────
interface AddonItem {
  id: number;
  name: string;
  priceExtra: number;
}
const addons = ref<AddonItem[]>([]);
const showAddAddon = ref(false);
const addonForm = reactive({ name: "", priceExtra: 0 });

function saveAddon() {
  if (!addonForm.name.trim()) return;
  addons.value.push({
    id: Date.now(),
    name: addonForm.name,
    priceExtra: addonForm.priceExtra,
  });
  Object.assign(addonForm, { name: "", priceExtra: 0 });
  showAddAddon.value = false;
}
function removeAddon(id: number) {
  const idx = addons.value.findIndex((a) => a.id === id);
  if (idx !== -1) addons.value.splice(idx, 1);
}

// ── Variants ──────────────────────────────────────────────────────────────────
const showAddVariant = ref(false);

// ── Save ──────────────────────────────────────────────────────────────────────
function saveProduct() {
  if (!product.value) return;
  const idx = productStore.products.findIndex((p) => p.id === productId.value);
  const target = productStore.products[idx];
  if (idx !== -1 && target) {
    Object.assign(target, {
      name: form.name,
      sku: form.sku,
      categoryId: form.categoryId,
      cost: form.cost,
      price: form.price,
      stock: form.stock,
      updatedAt: new Date().toISOString(),
    });
    toast.success("บันทึกข้อมูลสินค้าสำเร็จ");
  }
}

// ── Barcode ───────────────────────────────────────────────────────────────────
function printBarcode() {
  // Integrate with JsBarcode or similar library
  window.print();
}

// ── Delete ────────────────────────────────────────────────────────────────────
const showDeleteConfirm = ref(false);

function doDelete() {
  const name = product.value?.name;
  const idx = productStore.products.findIndex((p) => p.id === productId.value);
  if (idx !== -1) productStore.products.splice(idx, 1);
  toast.success(`ลบ "${name}" สำเร็จ`);
  router.push("/products");
}
</script>
