<template>
  <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
    <h1 class="text-base font-semibold text-slate-800">{{ title }}</h1>
    <div class="flex items-center gap-3">
      <span class="text-sm text-slate-500">{{ datetime }}</span>
      <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
        <Icon name="heroicons:user" class="h-4 w-4 text-blue-600" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()

const titleMap: Record<string, string> = {
  '/dashboard': 'ภาพรวม',
  '/products': 'สินค้า',
  '/orders': 'ออเดอร์',
  '/customers': 'ลูกค้า',
  '/reports': 'รายงาน',
  '/settings': 'ตั้งค่า',
}

const title = computed(() => titleMap[route.path] ?? '')

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
