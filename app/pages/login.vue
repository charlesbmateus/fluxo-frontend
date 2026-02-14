<script lang="ts" setup>
definePageMeta({
  layout: false
})

const {login, loginWithGoogle, loginWithGithub} = useAuth()
const router = useRouter()
const route = useRoute()
const {locale, locales, setLocale, t} = useI18n()
const colorMode = useColorMode()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const rememberMe = ref(false)

// Get redirect URL from query params or default to dashboard
const redirectTo = computed(() => route.query.redirect as string || '/dashboard')

// Available locales for the language switcher
const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value)
})

// Toggle dark mode
const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await login(email.value, password.value)

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

  const result = await loginWithGoogle()

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

  const result = await loginWithGithub()

  if (result.success) {
    router.push(redirectTo.value)
  } else {
    error.value = result.error || t('auth.loginError')
  }

  loading.value = false
}
</script>

<template>
  <NuxtLayout name="auth">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
          class="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
      <div
          class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 dark:bg-yellow-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-100 dark:bg-purple-800/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Main Card -->
    <div
        class="backdrop-blur rounded-3xl shadow-2xl border dark:border-gray-700/50 overflow-hidden"
    >
      <div class="p-8 sm:p-8">
        <!-- Welcome Text -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ $t('auth.welcomeBack') || 'Welcome back' }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('auth.loginSubtitle') || 'Log in to access your marketplace' }}
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
        <div class="relative my-7">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                  {{ $t('auth.orEmail') || 'Or continue with email' }}
                </span>
          </div>
        </div>

        <!-- Login Form -->
        <form class="space-y-5" @submit.prevent="handleLogin">
          <div class="form-control">
            <input
                v-model="email"
                :placeholder="$t('auth.emailPlaceholder') || 'you@example.com'"
                class="input input-bordered w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-400/20 transition-all outline-none px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
                type="email"
            />
          </div>

          <div class="form-control">
            <input
                v-model="password"
                :placeholder="$t('auth.passwordPlaceholder') || '••••••••'"
                class="input input-bordered w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-400/20 transition-all outline-none px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
                type="password"
            />
          </div>

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                  v-model="rememberMe"
                  class="checkbox checkbox-sm checkbox-primary rounded border-2 border-gray-300 dark:border-gray-600"
                  type="checkbox"
              />
              <span
                  class="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                    {{ $t('auth.rememberMe') || 'Remember me' }}
                  </span>
            </label>
            <!-- TODO: Implement forgot password functionality -->
            <NuxtLink
                class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                to="/forgot-password"
            >
              {{ $t('auth.forgotPassword') || 'Forgot password?' }}
            </NuxtLink>
          </div>

          <!-- Error Alert -->
          <div v-if="error"
               class="alert bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
            <svg class="stroke-red-600 dark:stroke-red-400 shrink-0 h-5 w-5 mt-0.5"
                 fill="none" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
            <span class="text-sm text-red-800 dark:text-red-200">{{ error }}</span>
          </div>

          <!-- Submit Button -->
          <div class="form-control pt-2">
            <button
                :disabled="loading"
                class="btn w-full h-12 rounded-xl border-0 bg-gradient-to-r from-purple-600 via-purple-600 to-purple-700 hover:from-purple-700 hover:via-purple-700 hover:to-purple-800 text-white text-base font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-600/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                type="submit"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              <span>{{
                  loading ? ($t('common.loading') || 'Loading...') : ($t('auth.signIn') || 'Sign in')
                }}</span>
            </button>

            <!-- Sign Up Link -->
            <div class="text-center mt-6">
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t('auth.noAccount') || "Don't have an account?" }}
                <NuxtLink
                    class="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors ml-1"
                    to="/register"
                >
                  {{ $t('auth.signUp') || 'Sign up' }}
                </NuxtLink>
              </p>
            </div>

          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
/* Animated blobs */
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Custom checkbox styling for purple theme */
.checkbox-primary:checked {
  background-color: #8B5CF6;
  border-color: #8B5CF6;
}

/* Smooth focus ring */
input:focus {
  outline: none;
}

/* Gradient text for brand */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>