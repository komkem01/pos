<template>
  <aside class="flex w-64 shrink-0 flex-col bg-slate-900">

    <!-- Logo -->
    <div class="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 px-5">
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600">
        <Icon name="heroicons:shopping-bag" class="h-5 w-5 text-white" />
      </div>
      <div class="min-w-0">
        <p class="truncate text-sm font-bold text-white">{{ setting.storeName }}</p>
        <p class="text-[10px] text-slate-500">ระบบหลังบ้าน</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3 py-3">
      <div class="space-y-0.5">
        <template v-for="group in navGroups" :key="group.label">

          <!-- Direct link (no children) -->
          <NuxtLink
            v-if="!group.children"
            :to="group.to!"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            :class="isActive(group.to!)
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
          >
            <Icon :name="group.icon" class="h-4 w-4 shrink-0" />
            {{ group.label }}
          </NuxtLink>

          <!-- Accordion group -->
          <div v-else>
            <button
              class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              :class="isGroupOpen(group)
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
              @click="toggleGroup(group.label)"
            >
              <Icon :name="group.icon" class="h-4 w-4 shrink-0" />
              <span class="flex-1 text-left">{{ group.label }}</span>
              <!-- badge -->
              <span
                v-if="group.badge"
                class="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white"
              >{{ group.badge }}</span>
              <Icon
                name="heroicons:chevron-right"
                class="h-3.5 w-3.5 shrink-0 transition-transform duration-200"
                :class="isGroupOpen(group) ? 'rotate-90' : ''"
              />
            </button>

            <!-- Children -->
            <Transition name="accordion">
              <div v-if="isGroupOpen(group)" class="mt-0.5 space-y-0.5 pl-3">
                <NuxtLink
                  v-for="child in group.children"
                  :key="child.to"
                  :to="child.to"
                  class="flex items-center gap-2.5 rounded-xl py-2 pl-3 pr-3 text-sm transition-colors"
                  :class="isActive(child.to)
                    ? 'bg-blue-600/20 font-semibold text-blue-400'
                    : 'font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-200'"
                >
                  <span
                    class="h-1.5 w-1.5 shrink-0 rounded-full transition-colors"
                    :class="isActive(child.to) ? 'bg-blue-400' : 'bg-slate-600'"
                  />
                  {{ child.label }}
                </NuxtLink>
              </div>
            </Transition>
          </div>

        </template>
      </div>
    </nav>

    <!-- Bottom -->
    <div class="shrink-0 space-y-2 border-t border-slate-800 p-3">
      <!-- POS shortcut -->
      <NuxtLink
        to="/pos"
        class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
      >
        <Icon name="heroicons:computer-desktop" class="h-4 w-4" />
        ไปหน้าขาย
      </NuxtLink>

      <!-- User + logout -->
      <div class="flex items-center gap-2 rounded-xl px-3 py-2">
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300">
          {{ auth.username.charAt(0).toUpperCase() }}
        </div>
        <span class="flex-1 truncate text-xs text-slate-400">{{ auth.username }}</span>
        <button
          class="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
          title="ออกจากระบบ"
          @click="showLogoutConfirm = true"
        >
          <Icon name="heroicons:arrow-right-on-rectangle" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <UiConfirmModal
      :show="showLogoutConfirm"
      title="ออกจากระบบ?"
      description="ต้องเข้าสู่ระบบใหม่เพื่อใช้งานต่อไป"
      icon="heroicons:arrow-right-on-rectangle"
      confirm-label="ออกจากระบบ"
      cancel-label="ยังอยู่"
      @confirm="handleLogout"
      @cancel="showLogoutConfirm = false"
    />
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
const setting = useSettingStore()
const auth = useAuthStore()
const showLogoutConfirm = ref(false)

async function handleLogout() {
  showLogoutConfirm.value = false
  auth.logout()
  await navigateTo('/login')
}

interface NavChild { label: string; to: string }
interface NavGroup {
  label: string
  icon: string
  to?: string
  badge?: string
  children?: NavChild[]
}

const navGroups: NavGroup[] = [
  {
    label: 'ภาพรวม',
    icon: 'heroicons:squares-2x2',
    to: '/dashboard',
  },
  {
    label: 'สินค้า',
    icon: 'heroicons:archive-box',
    children: [
      { label: 'รายการสินค้า', to: '/products' },
      { label: 'หมวดหมู่', to: '/products/categories' },
      { label: 'จัดการสต็อก', to: '/products/stock' },
    ],
  },
  {
    label: 'ออเดอร์',
    icon: 'heroicons:clipboard-document-list',
    children: [
      { label: 'รายการออเดอร์', to: '/orders' },
      { label: 'ประวัติออเดอร์', to: '/orders/history' },
    ],
  },
  {
    label: 'ลูกค้า',
    icon: 'heroicons:user-group',
    children: [
      { label: 'รายการลูกค้า', to: '/customers' },
      { label: 'สมาชิก / พอยท์', to: '/customers/membership' },
    ],
  },
  {
    label: 'รายงาน',
    icon: 'heroicons:chart-bar',
    children: [
      { label: 'ยอดขายรวม', to: '/reports' },
      { label: 'รายงานรายวัน', to: '/reports/daily' },
      { label: 'รายงานกะ', to: '/reports/shifts' },
      { label: 'กำไร-ขาดทุน', to: '/reports/profit' },
    ],
  },
  {
    label: 'ตั้งค่า',
    icon: 'heroicons:cog-6-tooth',
    children: [
      { label: 'ทั่วไป', to: '/settings' },
      { label: 'เครื่องพิมพ์', to: '/settings/printer' },
      { label: 'ผู้ใช้งาน', to: '/settings/users' },
      { label: 'การชำระเงิน', to: '/settings/payment' },
    ],
  },
]

// ── Accordion state ──────────────────────────────────────────────────
const openGroups = ref<Set<string>>(new Set())

function isActive(to: string) {
  return route.path === to
}

function isGroupActive(group: NavGroup): boolean {
  return group.children?.some(c => route.path.startsWith(c.to)) ?? false
}

function isGroupOpen(group: NavGroup): boolean {
  return openGroups.value.has(group.label) || isGroupActive(group)
}

function toggleGroup(label: string) {
  if (openGroups.value.has(label)) {
    openGroups.value.delete(label)
  } else {
    openGroups.value.add(label)
  }
}

// Auto-open group containing current route on first render
onMounted(() => {
  for (const group of navGroups) {
    if (isGroupActive(group)) openGroups.value.add(group.label)
  }
})

watch(() => route.path, () => {
  for (const group of navGroups) {
    if (isGroupActive(group)) openGroups.value.add(group.label)
  }
})
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>
