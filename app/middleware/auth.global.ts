export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/marketplace', '/service']
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => {
    // Exact match for home page
    if (route === '/' && to.path === '/') return true
    // Starts with for other routes
    if (route !== '/' && to.path.startsWith(route)) return true
    return false
  })
  
  // If user is not authenticated and trying to access a protected route
  if (!authStore.isAuthenticated && !isPublicRoute) {
    return navigateTo('/login')
  }
  
  // If user is authenticated and trying to access login/register/home, redirect to dashboard
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register' || to.path === '/')) {
    return navigateTo('/dashboard')
  }
})
