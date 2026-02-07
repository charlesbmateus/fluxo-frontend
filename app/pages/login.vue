<template>
  <NuxtLayout name="auth">
    <div class="card bg-base-100 shadow-2xl">
      <div class="card-body">
        <h2 class="card-title text-2xl justify-center mb-4">{{ $t('auth.login') }}</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="form-control">
            <input 
              v-model="email" 
              type="email" 
              :placeholder="$t('auth.email')"
              class="input input-bordered w-full" 
              required 
            />
          </div>
          
          <div class="form-control">
            <input 
              v-model="password" 
              type="password" 
              :placeholder="$t('auth.password')"
              class="input input-bordered w-full" 
              required 
            />
            <!-- TODO: Implement forgot password functionality -->
            <!-- <label class="label">
              <a href="#" class="label-text-alt link link-hover">{{ $t('auth.forgotPassword') }}</a>
            </label> -->
          </div>

          <div v-if="error" class="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
          </div>
          
          <div class="form-control mt-6">
            <button 
              type="submit" 
              class="btn btn-primary w-full" 
              :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner"></span>
              {{ loading ? $t('common.loading') : $t('auth.signIn') }}
            </button>
          </div>
        </form>

        <div class="divider">{{ $t('auth.continueWith') }}</div>

        <!-- SSO Buttons -->
        <div class="space-y-2">
          <button 
            @click="handleGoogleLogin" 
            class="btn btn-outline w-full"
            :disabled="loading"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          
          <button 
            @click="handleGithubLogin" 
            class="btn btn-outline w-full"
            :disabled="loading"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <div class="text-center mt-4">
          <p class="text-sm">
            {{ $t('auth.noAccount') }}
            <NuxtLink to="/register" class="link link-primary">{{ $t('auth.signUp') }}</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const { login, loginWithGoogle, loginWithGithub } = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Get redirect URL from query params or default to dashboard
const redirectTo = computed(() => route.query.redirect as string || '/')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.login(email.value, password.value)
  
  if (result.success) {
    router.push(redirectTo.value)
  } else {
    error.value = result.error || t('auth.loginError')
  }
  
  loading.value = false
}

const handleGoogleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.loginWithGoogle()
  
  if (result.success) {
    router.push(redirectTo.value)
  } else {
    error.value = result.error || t('auth.loginError')
  }
  
  loading.value = false
}

const handleGithubLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.loginWithGithub()
  
  if (result.success) {
    router.push(redirectTo.value)
  } else {
    error.value = result.error || t('auth.loginError')
  }
  
  loading.value = false
}
</script>
