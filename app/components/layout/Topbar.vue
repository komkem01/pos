<template>
  <header class="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm">
      <span class="font-semibold text-slate-800">{{ pageTitle }}</span>
      <template v-if="subTitle">
        <Icon name="heroicons:chevron-right" class="h-3.5 w-3.5 text-slate-300" />
        <span class="text-slate-500">{{ subTitle }}</span>
      </template>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-4">
      <span class="hidden text-xs text-slate-400 sm:block">{{ datetime }}</span>
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
        {{ auth.username.charAt(0).toUpperCase() }}
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const auth = useAuthStore()

const titleMap: Record<string, { parent: string; sub?: string }> = {
  '/dashboard':             { parent: 'ภาพรวม' },
  '/products':              { parent: 'สินค้า', sub: 'รายการสินค้า' },
  '/products/categories':   { parent: 'สินค้า', sub: 'หมวดหมู่' },
  '/products/stock':        { parent: 'สินค้า', sub: 'จัดการสต็อก' },
  '/orders':                { parent: 'ออเดอร์', sub: 'รายการออเดอร์' },
  '/orders/history':        { parent: 'ออเดอร์', sub: 'ประวัติออเดอร์' },
  '/customers':             { parent: 'ลูกค้า', sub: 'รายการลูกค้า' },
  '/customers/membership':  { parent: 'ลูกค้า', sub: 'สมาชิก / พอยท์' },
  '/reports':               { parent: 'รายงาน', sub: 'ยอดขายรวม' },
  '/reports/daily':         { parent: 'รายงาน', sub: 'รายงานรายวัน' },
  '/reports/shifts':        { parent: 'รายงาน', sub: 'รายงานกะ' },
  '/reports/profit':        { parent: 'รายงาน', sub: 'กำไร-ขาดทุน' },
  '/settings':              { parent: 'ตั้งค่า', sub: 'ทั่วไป' },
  '/settings/printer':      { parent: 'ตั้งค่า', sub: 'เครื่องพิมพ์' },
  '/settings/users':        { parent: 'ตั้งค่า', sub: 'ผู้ใช้งาน' },
  '/settings/payment':      { parent: 'ตั้งค่า', sub: 'การชำระเงิน' },
}

const pageTitle = computed(() => titleMap[route.path]?.parent ?? '')
const subTitle = computed(() => titleMap[route.path]?.sub)

const datetime = ref('')
onMounted(() => {
  const update = () => {
    datetime.value = new Intl.DateTimeFormat('th-TH', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date())
  }
  update()
  setInterval(update, 60000)
})
</script>
