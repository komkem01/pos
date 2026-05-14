<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-800">ผู้ใช้งาน</h2>
        <p class="text-sm text-slate-500">จัดการบัญชีและสิทธิ์การใช้งาน</p>
      </div>
      <button class="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
        <Icon name="heroicons:user-plus" class="h-4 w-4" />
        เพิ่มผู้ใช้
      </button>
    </div>

    <!-- Role cards -->
    <div class="mb-6 grid grid-cols-3 gap-4">
      <div v-for="role in roles" :key="role.name" class="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" :class="role.bg">
          <Icon :name="role.icon" class="h-5 w-5" :class="role.iconColor" />
        </div>
        <div>
          <p class="font-semibold text-slate-800">{{ role.name }}</p>
          <p class="text-xs text-slate-400">{{ role.count }} คน</p>
        </div>
      </div>
    </div>

    <!-- Users table -->
    <UiCard padding="none">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">ผู้ใช้</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">บทบาท</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">เข้าใช้ล่าสุด</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">สถานะ</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                  {{ u.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="font-semibold text-slate-800">{{ u.username }}</p>
                  <p class="text-xs text-slate-400">{{ u.displayName }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="u.roleClass">{{ u.role }}</span>
            </td>
            <td class="px-4 py-3 text-slate-500">{{ u.lastLogin }}</td>
            <td class="px-4 py-3 text-center">
              <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                {{ u.active ? 'ใช้งาน' : 'ระงับ' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-1">
                <button class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600">
                  <Icon name="heroicons:pencil-square" class="h-4 w-4" />
                </button>
                <button class="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
                  <Icon name="heroicons:trash" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const roles = [
  { name: 'ผู้ดูแลระบบ', count: 1, icon: 'heroicons:shield-check', bg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { name: 'ผู้จัดการ', count: 2, icon: 'heroicons:briefcase', bg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { name: 'แคชเชียร์', count: 4, icon: 'heroicons:user', bg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
]

const users = [
  { id: 1, username: 'admin', displayName: 'ผู้ดูแลระบบ', role: 'Admin', roleClass: 'bg-blue-100 text-blue-700', lastLogin: '15 พ.ค. 69 · 09:01', active: true },
  { id: 2, username: 'manager01', displayName: 'สมชาย ผู้จัดการ', role: 'Manager', roleClass: 'bg-purple-100 text-purple-700', lastLogin: '14 พ.ค. 69 · 18:30', active: true },
  { id: 3, username: 'cashier01', displayName: 'นิดา แคชเชียร์', role: 'Cashier', roleClass: 'bg-emerald-100 text-emerald-700', lastLogin: '13 พ.ค. 69 · 20:45', active: true },
  { id: 4, username: 'cashier02', displayName: 'วิทย์ แคชเชียร์', role: 'Cashier', roleClass: 'bg-emerald-100 text-emerald-700', lastLogin: '10 พ.ค. 69 · 17:00', active: false },
]
</script>
