<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
          <Icon name="heroicons:shopping-bag" class="h-7 w-7 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-slate-800">{{ setting.storeName }}</h1>
        <p class="mt-1 text-sm text-slate-500">ระบบจัดการร้านค้า POS</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="mb-5 text-base font-semibold text-slate-700">เข้าสู่ระบบ</h2>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">ชื่อผู้ใช้</label>
            <input
              v-model="form.username"
              type="text"
              autocomplete="username"
              placeholder="admin"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">รหัสผ่าน</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••"
                class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                @click="showPass = !showPass"
              >
                <Icon :name="showPass ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              กำลังเข้าสู่ระบบ...
            </span>
            <span v-else>เข้าสู่ระบบ</span>
          </button>
        </form>
      </div>

      <!-- Demo hint -->
      <p class="mt-4 text-center text-xs text-slate-400">
        Demo: <span class="font-medium text-slate-500">admin</span> /
        <span class="font-medium text-slate-500">1234</span>
      </p>
    </div>
  </div>
  <UiToast />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const auth = useAuthStore()
const setting = useSettingStore()
const toast = useToast()

const form = reactive({ username: '', password: '' })
const showPass = ref(false)
const loading = ref(false)

async function handleLogin() {
  loading.value = true

  await new Promise((r) => setTimeout(r, 400))

  const ok = auth.login(form.username, form.password)
  if (ok) {
    toast.success('เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับ ${auth.username}`)
    await navigateTo('/pos')
  } else {
    toast.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
  }

  loading.value = false
}
</script>

<style scoped>
</style>
