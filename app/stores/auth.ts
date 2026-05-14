import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

// Demo credentials — replace with real API later
const CREDENTIALS = { username: 'admin', password: '1234' }

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = useLocalStorage('pos_auth', false)
  const username = useLocalStorage('pos_username', '')

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
