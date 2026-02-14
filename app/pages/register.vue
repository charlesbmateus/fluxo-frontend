<script setup lang="ts">
definePageMeta({
  layout: false
})

const { register, loginWithGoogle, loginWithGithub } = useAuth()
const router = useRouter()
const { t } = useI18n()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = t('auth.passwordsDontMatch')
    loading.value = false
    return
  }

  const result = await register(name.value, email.value, password.value)

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error || t('auth.registerError')
  }

  loading.value = false
}

const handleGoogleLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await loginWithGoogle()

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error || t('auth.loginError')
  }

  loading.value = false
}

const handleGithubLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await loginWithGithub()

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error || t('auth.loginError')
  }

  loading.value = false
}

// Computed para validar que las contraseñas coincidan
const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return true
  return password.value === confirmPassword.value
})
</script>

<template>
  <NuxtLayout name="auth">
    <div class="backdrop-blur rounded-3xl shadow-2xl border dark:border-gray-700/50 overflow-hidden">
      <div class="card-body">
        <!-- Header -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ $t('auth.createAccount') || 'Create Account' }}
          </h2>
          <p class="text-base-content/60">
            {{ $t('auth.registerSubtitle') || 'Join Fluxo and start exploring' }}
          </p>
        </div>

        <!-- SSO Buttons -->
        <div class="grid grid-cols-3 gap-3 mb-3">
          <!-- Google Button -->
          <button
              :disabled="loading"
              :title="$t('auth.continueGoogle') || 'Continue with Google'"
              class="group relative w-full h-12 px-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-white dark:hover:from-purple-900/30 dark:hover:to-gray-700 transition-all duration-200 flex items-center justify-center gap-3 font-medium text-gray-700 dark:text-gray-200 hover:text-purple-700 dark:hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              @click="handleGoogleLogin"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"/>
              <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"/>
              <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"/>
              <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"/>
            </svg>
          </button>

          <!-- Facebook Button -->
          <button
              :disabled="loading"
              :title="$t('auth.continueFacebook') || 'Continue with Facebook'"
              class="group relative w-full h-12 px-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-white dark:hover:from-purple-900/30 dark:hover:to-gray-700 transition-all duration-200 flex items-center justify-center gap-3 font-medium text-gray-700 dark:text-gray-200 hover:text-purple-700 dark:hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              @click="handleFacebookLogin"
          >
            <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>

          <!-- Apple Button -->
          <button
              :disabled="loading"
              :title="$t('auth.continueApple') || 'Continue with Apple'"
              class="group relative w-full h-12 px-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-white dark:hover:from-purple-900/30 dark:hover:to-gray-700 transition-all duration-200 flex items-center justify-center gap-3 font-medium text-gray-700 dark:text-gray-200 hover:text-purple-700 dark:hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              @click="handleAppleLogin"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
          </button>
        </div>

        <!-- Divider -->
        <div class="divider text-sm">{{ $t('auth.orEmail') || 'Or continue with email' }}</div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Name -->
          <div class="form-control">
            <input
                v-model="name"
                type="text"
                :placeholder="$t('auth.namePlaceholder') || 'John Doe'"
                class="input input-bordered w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-400/20 transition-all outline-none px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
            />
          </div>

          <!-- Email -->
          <div class="form-control">
            <input
                v-model="email"
                type="email"
                :placeholder="$t('auth.emailPlaceholder') || 'you@example.com'"
                class="input input-bordered w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-400/20 transition-all outline-none px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
            />
          </div>

          <!-- Password -->
          <div class="form-control">
            <input
                v-model="password"
                type="password"
                :placeholder="$t('auth.passwordPlaceholder') || '••••••••'"
                class="input input-bordered w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-400/20 transition-all outline-none px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
            />
          </div>

          <!-- Confirm Password -->
          <div class="form-control">
            <input
                v-model="confirmPassword"
                type="password"
                :placeholder="$t('auth.passwordPlaceholder') || '••••••••'"
                class="input input-bordered w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-400/20 transition-all outline-none px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                :class="{ 'input-error border-error': confirmPassword && !passwordsMatch }"
                required
            />
            <label v-if="confirmPassword && !passwordsMatch" class="label">
              <span class="label-text-alt text-error">{{ $t('auth.passwordsDontMatch') || 'Passwords do not match' }}</span>
            </label>
          </div>

          <!-- Error Alert -->
          <div v-if="error" class="alert alert-error rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Submit Button -->
          <div class="form-control mt-6">
            <button
                type="submit"
                class="btn w-full h-12 rounded-xl border-0 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-base font-semibold shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner"></span>
              {{ loading ? ($t('common.loading') || 'Loading...') : ($t('auth.createAccount') || 'Create Account') }}
            </button>
          </div>
        </form>

        <!-- Sign In Link -->
        <div class="text-center mt-6">
          <p class="text-sm">
            {{ $t('auth.alreadyHaveAccount') || 'Already have an account?' }}
            <NuxtLink to="/login" class="link link-primary font-semibold">
              {{ $t('auth.signIn') || 'Sign in' }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
/* Custom focus styles */
.input:focus {
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

/* Smooth transitions */
.btn {
  transition: all 0.2s ease-in-out;
}

/* Gradient text for brand */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>