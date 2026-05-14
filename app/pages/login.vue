<template>
  <div class="flex min-h-screen bg-white">

    <!-- Left: Brand panel (hidden on mobile) -->
    <div class="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 lg:flex lg:w-[52%]">
      <!-- Decorative circles -->
      <div class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
      <div class="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/5" />
      <div class="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
      <div class="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]" />

      <!-- Brand content -->
      <div class="relative z-10 flex flex-col items-center gap-6 px-12 text-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 shadow-2xl shadow-blue-900/40 ring-1 ring-white/20 backdrop-blur-sm">
          <Icon name="heroicons:shopping-bag" class="h-10 w-10 text-white" />
        </div>
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight text-white">{{ setting.storeName }}</h1>
          <p class="mt-2 text-lg text-blue-200">ระบบจัดการร้านค้า POS</p>
        </div>

        <!-- Feature list -->
        <ul class="mt-4 space-y-3 text-left">
          <li v-for="f in features" :key="f" class="flex items-center gap-3">
            <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Icon name="heroicons:check" class="h-3.5 w-3.5 text-white" />
            </div>
            <span class="text-sm text-blue-100">{{ f }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Right: Login form -->
    <div class="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
      <!-- Mobile logo -->
      <div class="mb-8 flex flex-col items-center lg:hidden">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
          <Icon name="heroicons:shopping-bag" class="h-7 w-7 text-white" />
        </div>
        <h1 class="mt-3 text-2xl font-bold text-slate-800">{{ setting.storeName }}</h1>
        <p class="mt-1 text-sm text-slate-400">ระบบจัดการร้านค้า POS</p>
      </div>

      <div class="w-full max-w-sm">
        <!-- Heading -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-slate-800">ยินดีต้อนรับ</h2>
          <p class="mt-1 text-sm text-slate-500">กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน</p>
        </div>

        <!-- Form -->
        <form class="space-y-5" @submit.prevent="handleLogin">
          <!-- Username -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">ชื่อผู้ใช้</label>
            <div class="relative">
              <Icon
                name="heroicons:user"
                class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                v-model="form.username"
                type="text"
                autocomplete="username"
                placeholder="admin"
                class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">รหัสผ่าน</label>
            <div class="relative">
              <Icon
                name="heroicons:lock-closed"
                class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                @click="showPass = !showPass"
              >
                <Icon :name="showPass ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <Icon v-else name="heroicons:arrow-right-on-rectangle" class="h-4 w-4" />
            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </form>

        <!-- Demo hint -->
        <div class="mt-6 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <Icon name="heroicons:information-circle" class="h-4 w-4 shrink-0 text-slate-400" />
          <p class="text-xs text-slate-500">
            Demo: ชื่อผู้ใช้ <span class="font-semibold text-slate-700">admin</span>
            รหัสผ่าน <span class="font-semibold text-slate-700">1234</span>
          </p>
        </div>
      </div>
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

const features = [
  'จัดการออเดอร์และตะกร้าสินค้า',
  'รองรับการชำระเงินหลายช่องทาง',
  'ระบบกะ เปิด-ปิดร้านได้ง่าย',
  'รายงานยอดขายแบบ Real-time',
]

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

