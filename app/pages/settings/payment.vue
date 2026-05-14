<template>
  <div>
    <div class="mb-6">
      <h2 class="text-lg font-bold text-slate-800">การชำระเงิน</h2>
      <p class="text-sm text-slate-500">กำหนดช่องทางและตัวเลือกการชำระเงิน</p>
    </div>

    <div class="space-y-4">
      <!-- Payment methods -->
      <UiCard title="ช่องทางการชำระเงิน">
        <div class="space-y-3">
          <div v-for="method in paymentMethods" :key="method.name" class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl" :class="method.bg">
                <Icon :name="method.icon" class="h-5 w-5" :class="method.iconColor" />
              </div>
              <div>
                <p class="font-semibold text-slate-800">{{ method.name }}</p>
                <p class="text-xs text-slate-400">{{ method.desc }}</p>
              </div>
            </div>
            <div
              class="relative h-6 w-11 cursor-pointer rounded-full transition-colors"
              :class="method.enabled ? 'bg-blue-600' : 'bg-slate-200'"
              @click="method.enabled = !method.enabled"
            >
              <div
                class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform"
                :class="method.enabled ? 'translate-x-6' : 'translate-x-1'"
              />
            </div>
          </div>
        </div>
      </UiCard>

      <!-- QR config -->
      <UiCard title="ตั้งค่า QR พร้อมเพย์">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">เลขพร้อมเพย์ / เลขบัญชี</label>
            <input value="0812345678" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">ชื่อบัญชี</label>
            <input value="ร้านกาแฟตัวอย่าง" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div class="col-span-2">
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">QR Code สำหรับรับชำระ</label>
            <div class="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-300">
              <Icon name="heroicons:qr-code" class="h-12 w-12" />
            </div>
            <button class="mt-2 text-xs font-medium text-blue-600 hover:underline">อัปโหลด QR Code</button>
          </div>
        </div>
      </UiCard>

      <!-- Tax config -->
      <UiCard title="ภาษีและส่วนลด">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span class="text-sm text-slate-700">เปิดใช้ VAT 7%</span>
            <div class="h-6 w-10 cursor-pointer rounded-full bg-slate-300" />
          </div>
          <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span class="text-sm text-slate-700">อนุญาตส่วนลด</span>
            <div class="h-6 w-10 cursor-pointer rounded-full bg-blue-600" />
          </div>
        </div>
      </UiCard>
    </div>

    <div class="mt-4 flex justify-end">
      <button class="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
        บันทึกการตั้งค่า
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const paymentMethods = reactive([
  { name: 'เงินสด', desc: 'รับชำระด้วยเงินสดปกติ', icon: 'heroicons:banknotes', bg: 'bg-emerald-100', iconColor: 'text-emerald-600', enabled: true },
  { name: 'QR พร้อมเพย์', desc: 'สแกน QR โอนเงิน', icon: 'heroicons:qr-code', bg: 'bg-blue-100', iconColor: 'text-blue-600', enabled: true },
  { name: 'บัตรเครดิต/เดบิต', desc: 'รูดบัตรผ่านเครื่อง EDC', icon: 'heroicons:credit-card', bg: 'bg-purple-100', iconColor: 'text-purple-600', enabled: false },
])
</script>
