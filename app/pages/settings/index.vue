<template>
  <div class="max-w-lg">
    <UiCard title="ข้อมูลร้าน">
      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">ชื่อร้าน</label>
          <input
            v-model="setting.storeName"
            type="text"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-700">เปิดใช้ภาษีมูลค่าเพิ่ม (VAT 7%)</p>
            <p class="text-xs text-slate-400">คำนวณภาษีในใบเสร็จ</p>
          </div>
          <button
            :class="[
              'relative h-6 w-11 rounded-full transition-colors',
              setting.taxEnabled ? 'bg-blue-600' : 'bg-slate-200',
            ]"
            @click="setting.taxEnabled = !setting.taxEnabled"
          >
            <span
              :class="[
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                setting.taxEnabled ? 'translate-x-5' : 'translate-x-0.5',
              ]"
            />
          </button>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">ข้อความท้ายใบเสร็จ</label>
          <input
            v-model="setting.receiptFooter"
            type="text"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          @click="toast.success('บันทึกการตั้งค่าแล้ว')"
        >
          บันทึก
        </button>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const setting = useSettingStore()
const toast = useToast()
</script>
