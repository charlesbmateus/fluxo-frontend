export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    return
  }

  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/marketplace',
    '/service',
  ]

  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/' && to.path === '/') return true
    if (route !== '/' && to.path.startsWith(route)) return true
    return false
  })

  // PROTECTED ROUTE
  if (!auth.isAuthenticated && !isPublicRoute) {
    return navigateTo('/login')
  }

  // LOGGED USER
  if (
      auth.isAuthenticated &&
      (to.path === '/login' || to.path === '/register')
  ) {
    return navigateTo('/dashboard')
  }
})