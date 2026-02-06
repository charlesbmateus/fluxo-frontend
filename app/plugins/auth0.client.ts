import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  
  const auth0 = createAuth0({
    domain: runtimeConfig.public.auth0Domain || 'dev-example.us.auth0.com',
    clientId: runtimeConfig.public.auth0ClientId || 'YOUR_AUTH0_CLIENT_ID',
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
