<script setup lang="ts">
const { t } = useI18n()
const api = useApi()
const auth = useAuthStore()

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const connectStripe = async () => {
  if (!auth.token) return

  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await api.createStripeAccount(auth.token)
    if (response.data?.url) {
      window.location.href = response.data.url
    } else {
      successMessage.value = t('settings.stripeConnectSuccess')
    }
  } catch {
    errorMessage.value = t('settings.stripeConnectError')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent">
          {{ $t('nav.settings') }}
        </h1>
        <p class="text-base-content/60 mt-2 text-lg">
          {{ $t('settings.subtitle') }}
        </p>
      </div>

      <!-- Tabs -->
      <div class="tabs tabs-boxed bg-base-200 p-1 rounded-xl inline-flex">
        <NuxtLink to="/settings" class="tab gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ $t('settings.general') }}
        </NuxtLink>
        <NuxtLink to="/settings/security" class="tab gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {{ $t('settings.security') }}
        </NuxtLink>
        <NuxtLink to="/settings/notifications" class="tab gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {{ $t('settings.notifications') }}
        </NuxtLink>
        <NuxtLink to="/settings/payments" class="tab tab-active gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          {{ $t('settings.payments') }}
        </NuxtLink>
      </div>

      <!-- Success/Error Alerts -->
      <div v-if="successMessage" class="alert alert-success shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ successMessage }}</span>
      </div>

      <div v-if="errorMessage" class="alert alert-error shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Payment Setup -->
        <div class="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-xl">{{ $t('settings.paymentSetup') }}</h2>
                <p class="text-sm text-base-content/60">{{ $t('settings.paymentSetupDesc') }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="alert alert-info rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm">{{ $t('settings.stripeConnectInfo') }}</span>
              </div>

              <div class="p-6 rounded-xl bg-base-200/50 space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span class="font-semibold">{{ $t('settings.stripeConnect') }}</span>
                    <p class="text-xs text-base-content/60">{{ $t('settings.stripeConnectDesc') }}</p>
                  </div>
                </div>

                <button
                  class="btn btn-primary rounded-xl h-12 w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-0 shadow-lg shadow-purple-500/30"
                  :disabled="loading"
                  @click="connectStripe"
                >
                  <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {{ loading ? $t('settings.connecting') : $t('settings.connectWithStripe') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-lg">{{ $t('settings.paymentInfo') }}</h2>
                <p class="text-xs text-base-content/60">{{ $t('settings.paymentInfoDesc') }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-start gap-3 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm">{{ $t('settings.paymentBenefit1') }}</span>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm">{{ $t('settings.paymentBenefit2') }}</span>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm">{{ $t('settings.paymentBenefit3') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Saved Payment Methods -->
      <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
        <div class="card-body">
          <StripeCardManager />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
