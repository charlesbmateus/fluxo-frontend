<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body">
        <div class="text-center mb-6">
          <h1 class="text-4xl font-bold">
            <span class="text-primary">Fluxo</span>
          </h1>
          <p class="text-base-content/60 mt-2">{{ $t('auth.joinUs') }}</p>
        </div>
        
        <h2 class="text-2xl font-bold text-center mb-6">{{ $t('auth.register') }}</h2>
        
        <!-- Auth0 Register -->
        <button @click="handleRegister" class="btn btn-primary btn-block mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
          {{ $t('auth.registerWithSSO') }}
        </button>

        <div class="divider">{{ $t('auth.or') }}</div>

        <!-- Email/Password Register Form -->
        <form @submit.prevent="handleEmailRegister" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ $t('auth.fullName') }}</span>
            </label>
            <input 
              v-model="fullName" 
              type="text" 
              :placeholder="$t('auth.fullNamePlaceholder')"
              class="input input-bordered" 
              required 
            />
          </div>

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
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ $t('auth.confirmPassword') }}</span>
            </label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              :placeholder="$t('auth.confirmPasswordPlaceholder')"
              class="input input-bordered" 
              required 
            />
          </div>

          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-2">
              <input type="checkbox" class="checkbox checkbox-primary" required />
              <span class="label-text">{{ $t('auth.agreeToTerms') }}</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            {{ $t('auth.createAccount') }}
          </button>
        </form>

        <div class="divider"></div>

        <div class="text-center">
          <p class="text-sm">
            {{ $t('auth.alreadyHaveAccount') }}
            <NuxtLink to="/login" class="link link-primary">{{ $t('auth.login') }}</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

definePageMeta({
  layout: false
})

const { loginWithRedirect } = useAuth0()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  try {
    // Auth0 signup with redirect
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      }
    })
  } catch (error) {
    console.error('Register error:', error)
  }
}

const handleEmailRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!')
    return
  }
  
  // For demo purposes, just redirect to dashboard
  // In production, this would register with Auth0
  console.log('Email register:', fullName.value, email.value, password.value)
  router.push('/')
}
</script>
