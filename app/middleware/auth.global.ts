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

  // PROVIDER-ONLY ROUTES
  const providerOnlyRoutes = ['/dashboard/availability']
  const isProviderOnlyRoute = providerOnlyRoutes.some(route => to.path.startsWith(route))
  if (auth.isAuthenticated && isProviderOnlyRoute && auth.user?.role !== 'provider' && auth.user?.role !== 'admin') {
    return navigateTo('/dashboard')
  }

  // LOGGED USER
  if (
      auth.isAuthenticated &&
      (to.path === '/' || to.path === '/login' || to.path === '/register')
  ) {
    return navigateTo('/dashboard')
  }
})