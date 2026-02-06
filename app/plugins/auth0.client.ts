import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  
  // Only initialize if Auth0 credentials are provided
  if (!runtimeConfig.public.auth0Domain || !runtimeConfig.public.auth0ClientId) {
    console.warn('Auth0 credentials not configured. Set NUXT_PUBLIC_AUTH0_DOMAIN and NUXT_PUBLIC_AUTH0_CLIENT_ID environment variables.')
    return
  }
  
  const auth0 = createAuth0({
    domain: runtimeConfig.public.auth0Domain,
    clientId: runtimeConfig.public.auth0ClientId,
    authorizationParams: {
      redirect_uri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    }
  })

  nuxtApp.vueApp.use(auth0)
  
  return {
    provide: {
      auth0
    }
  }
})
