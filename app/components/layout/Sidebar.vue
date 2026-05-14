<template>
  <aside class="flex w-56 flex-col border-r border-slate-200 bg-white">
    <!-- Logo -->
    <div class="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
        <Icon name="heroicons:shopping-bag" class="h-4 w-4 text-white" />
      </div>
      <span class="font-semibold text-slate-800">{{ setting.storeName }}</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-0.5 overflow-y-auto p-3">
      <NuxtLink
        v-for="item in menu"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        :class="
          route.path === item.to
            ? 'bg-blue-50 text-blue-600'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        "
      >
        <Icon :name="item.icon" class="h-4.5 w-4.5 shrink-0" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <!-- Bottom actions -->
    <div class="space-y-2 border-t border-slate-200 p-3">
      <NuxtLink
        to="/pos"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <Icon name="heroicons:computer-desktop" class="h-4 w-4" />
        หน้าขาย
      </NuxtLink>
      <button
        class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition"
        @click="showLogoutConfirm = true"
      >
        <Icon name="heroicons:arrow-right-on-rectangle" class="h-4 w-4" />
        <span>ออกจากระบบ</span>
        <span class="ml-auto text-xs text-slate-400">({{ auth.username }})</span>
      </button>

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
    </div>
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

const menu = [
  { to: '/dashboard', icon: 'heroicons:squares-2x2', label: 'ภาพรวม' },
  { to: '/products', icon: 'heroicons:archive-box', label: 'สินค้า' },
  { to: '/orders', icon: 'heroicons:clipboard-document-list', label: 'ออเดอร์' },
  { to: '/customers', icon: 'heroicons:user-group', label: 'ลูกค้า' },
  { to: '/reports', icon: 'heroicons:chart-bar', label: 'รายงาน' },
  { to: '/settings', icon: 'heroicons:cog-6-tooth', label: 'ตั้งค่า' },
]
</script>
