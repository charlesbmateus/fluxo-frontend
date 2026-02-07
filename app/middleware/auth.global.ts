export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/marketplace']
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))
  
  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo('/login')
  }
  
  // If user is authenticated and trying to access login/register, redirect to dashboard
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
