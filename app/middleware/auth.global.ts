export default defineNuxtRouteMiddleware((to) => {
  // localStorage ไม่มีบน server — ข้ามทั้งหมดและให้ client จัดการ
  if (import.meta.server) return

  const auth = useAuthStore()

  // Already logged in → redirect away from login
  if (auth.isLoggedIn && to.path === '/login') {
    return navigateTo('/pos')
  }

  // Not logged in → redirect to login
  if (!auth.isLoggedIn && to.path !== '/login') {
    return navigateTo('/login')
  }

  // Shift guard: ป้องกันไม่ให้ logout จาก URL โดยตรงเมื่อยังเปิดกะอยู่
  if (process.client && to.path === '/login') {
    const shift = useShiftStore()
    if (shift.isOpen) {
      return navigateTo('/pos')
    }
  }
})
