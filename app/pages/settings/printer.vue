<template>
  <div>
    <div class="mb-6">
      <h2 class="text-lg font-bold text-slate-800">ตั้งค่าเครื่องพิมพ์</h2>
      <p class="text-sm text-slate-500">กำหนดค่าเครื่องพิมพ์ใบเสร็จ</p>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <!-- Printer config -->
      <UiCard title="เครื่องพิมพ์ใบเสร็จ">
        <div class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">ชื่อเครื่องพิมพ์</label>
            <input value="EPSON TM-T82III" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">ประเภทการเชื่อมต่อ</label>
            <select class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
              <option>USB</option>
              <option>Network (IP)</option>
              <option>Bluetooth</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">ขนาดกระดาษ</label>
            <select class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
              <option>80 mm</option>
              <option>58 mm</option>
            </select>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span class="text-sm text-slate-700">พิมพ์อัตโนมัติหลังชำระ</span>
            <div class="h-6 w-10 cursor-pointer rounded-full bg-blue-600" />
          </div>
        </div>
      </UiCard>

      <!-- Receipt preview -->
      <UiCard title="ตัวอย่างใบเสร็จ">
        <div class="mx-auto max-w-[200px] rounded-lg bg-white p-4 font-mono text-[10px] shadow ring-1 ring-slate-200">
          <p class="text-center font-bold">ร้านกาแฟตัวอย่าง</p>
          <p class="text-center text-slate-400">123/4 ถ.สุขุมวิท กรุงเทพ</p>
          <p class="text-center text-slate-400">Tel: 02-123-4567</p>
          <div class="my-2 border-t border-dashed border-slate-300" />
          <p>เลขที่: #0128</p>
          <p>วันที่: 15/05/69 14:32</p>
          <div class="my-2 border-t border-dashed border-slate-300" />
          <div class="flex justify-between"><span>ลาเต้ x1</span><span>60</span></div>
          <div class="flex justify-between"><span>อเมริกาโน่ x2</span><span>100</span></div>
          <div class="my-2 border-t border-dashed border-slate-300" />
          <div class="flex justify-between font-bold"><span>รวม</span><span>160</span></div>
          <div class="flex justify-between"><span>เงินสด</span><span>200</span></div>
          <div class="flex justify-between"><span>ทอน</span><span>40</span></div>
          <div class="my-2 border-t border-dashed border-slate-300" />
          <p class="text-center">ขอบคุณที่ใช้บริการ</p>
        </div>
        <button class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <Icon name="heroicons:printer" class="h-4 w-4" />
          ทดสอบพิมพ์
        </button>
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
</script>
