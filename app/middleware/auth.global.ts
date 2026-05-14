export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // Already logged in → redirect away from login
  if (auth.isLoggedIn && to.path === '/login') {
    return navigateTo('/pos')
  }

  // Not logged in → redirect to login
  if (!auth.isLoggedIn && to.path !== '/login') {
    return navigateTo('/login')
  }
})
