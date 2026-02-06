<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body">
        <div class="text-center mb-6">
          <h1 class="text-4xl font-bold">
            <span class="text-primary">Flu</span><span class="text-secondary">xo</span>
          </h1>
          <p class="text-base-content/60 mt-2">{{ $t('auth.welcomeBack') }}</p>
        </div>
        
        <h2 class="text-2xl font-bold text-center mb-6">{{ $t('auth.login') }}</h2>
        
        <!-- Auth0 Login -->
        <button @click="handleLogin" class="btn btn-primary btn-block mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          {{ $t('auth.loginWithSSO') }}
        </button>

        <div class="divider">{{ $t('auth.or') }}</div>

        <!-- Email/Password Login Form -->
        <form @submit.prevent="handleEmailLogin" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ $t('auth.email') }}</span>
            </label>
            <input 
              v-model="email" 
              type="email" 
              :placeholder="$t('auth.emailPlaceholder')"
              class="input input-bordered" 
              required 
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ $t('auth.password') }}</span>
            </label>
            <input 
              v-model="password" 
              type="password" 
              :placeholder="$t('auth.passwordPlaceholder')"
              class="input input-bordered" 
              required 
            />
            <label class="label">
              <a href="#" class="label-text-alt link link-hover">{{ $t('auth.forgotPassword') }}</a>
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            {{ $t('auth.login') }}
          </button>
        </form>

        <div class="divider"></div>

        <div class="text-center">
          <p class="text-sm">
            {{ $t('auth.noAccount') }}
            <NuxtLink to="/register" class="link link-primary">{{ $t('auth.signUp') }}</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: false
})

const router = useRouter()

const email = ref('')
const password = ref('')
let loginWithRedirect: any = null

onMounted(async () => {
  // Only import Auth0 on client side
  if (process.client) {
    const { useAuth0 } = await import('@auth0/auth0-vue')
    const auth0 = useAuth0()
    loginWithRedirect = auth0.loginWithRedirect
  }
})

const handleLogin = async () => {
  try {
    if (loginWithRedirect) {
      await loginWithRedirect()
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}

const handleEmailLogin = async () => {
  // For demo purposes, just redirect to dashboard
  // In production, this would authenticate with Auth0
  router.push('/')
}
</script>
