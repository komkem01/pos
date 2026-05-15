import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

// Demo credentials — replace with real API later
const CREDENTIALS = { username: 'admin', password: '1234' }

export const useAuthStore = defineStore('auth', () => {
  // skipHydrate: ป้องกัน Pinia ไม่ให้ overwrite ค่าจาก localStorage ด้วย SSR state (false)
  const isLoggedIn = skipHydrate(useLocalStorage('pos_auth', false))
  const username = skipHydrate(useLocalStorage('pos_username', ''))

  function login(user: string, pass: string): boolean {
    if (user === CREDENTIALS.username && pass === CREDENTIALS.password) {
      isLoggedIn.value = true
      username.value = user
      return true
    }
    return false
  }

  function logout() {
    isLoggedIn.value = false
    username.value = ''
  }

  return { isLoggedIn, username, login, logout }
})
