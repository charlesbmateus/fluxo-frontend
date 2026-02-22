<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()

/* ───── Password form (local state) ───── */
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const twoFactorEnabled = ref(false)

/* ───── Actions (placeholder for API later) ───── */
const changePassword = async () => {
  // TODO: call API /password update
  console.log('Changing password:', passwordForm)
}

const toggleTwoFactor = async () => {
  // TODO: call API /2fa toggle
  console.log('Two-factor:', twoFactorEnabled.value)
}

const deleteAccount = async () => {
  // TODO: call API /account delete
  console.log('Deleting account')
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
        <NuxtLink to="/settings/security" class="tab tab-active gap-2">
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
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Change Password -->
        <div class="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-xl">{{ $t('settings.changePassword') }}</h2>
                <p class="text-sm text-base-content/60">{{ $t('settings.changePasswordDesc') }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {{ $t('settings.currentPassword') }}
                  </span>
                </label>
                <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="input input-bordered rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    :placeholder="$t('settings.currentPasswordPlaceholder')"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {{ $t('settings.newPassword') }}
                  </span>
                </label>
                <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="input input-bordered rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    :placeholder="$t('settings.newPasswordPlaceholder')"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {{ $t('settings.confirmNewPassword') }}
                  </span>
                </label>
                <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    class="input input-bordered rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    :placeholder="$t('settings.confirmNewPasswordPlaceholder')"
                />
              </div>

              <div class="form-control mt-6">
                <button class="btn btn-primary rounded-xl h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-0 shadow-lg shadow-purple-500/30" @click="changePassword">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ $t('settings.updatePassword') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Two-Factor Authentication -->
        <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-lg">{{ $t('settings.twoFactor') }}</h2>
                <p class="text-xs text-base-content/60">{{ $t('settings.twoFactorDesc') }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="form-control">
                <label class="label cursor-pointer p-4 rounded-xl hover:bg-base-200 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span class="label-text font-semibold">{{ $t('settings.enableTwoFactor') }}</span>
                      <p class="text-xs text-base-content/60">{{ $t('settings.enableTwoFactorDesc') }}</p>
                    </div>
                  </div>
                  <input v-model="twoFactorEnabled" type="checkbox" class="toggle toggle-success" @change="toggleTwoFactor" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Sessions -->
        <div class="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-xl">{{ $t('settings.activeSessions') }}</h2>
                <p class="text-sm text-base-content/60">{{ $t('settings.activeSessionsDesc') }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between p-4 rounded-xl bg-base-200/50">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span class="font-semibold text-sm">{{ $t('settings.currentSession') }}</span>
                    <p class="text-xs text-base-content/60">{{ $t('settings.currentSessionDesc') }}</p>
                  </div>
                </div>
                <span class="badge badge-success badge-sm">{{ $t('settings.active') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Account -->
        <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-lg text-error">{{ $t('settings.dangerZone') }}</h2>
                <p class="text-xs text-base-content/60">{{ $t('settings.dangerZoneDesc') }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="alert alert-warning rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="text-xs">{{ $t('settings.actionCannotBeUndone') }}</span>
              </div>

              <button class="btn btn-outline btn-error rounded-xl w-full justify-start gap-3 h-auto py-3 hover:bg-error hover:text-error-content" @click="deleteAccount">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <div class="text-left">
                  <div class="font-semibold">{{ $t('settings.deleteAccount') }}</div>
                  <div class="text-xs opacity-60">{{ $t('settings.deleteAccountDesc') }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
