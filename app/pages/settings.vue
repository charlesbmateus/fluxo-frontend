<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import type { User } from '~/types/auth'

const { user } = useAuth()

/* ───── I18n & Theme ───── */
const { locale, locales, setLocale } = useI18n()
const colorMode = useColorMode()

const currentLocale = ref(locale.value)

const availableLocales = computed(() => locales.value)

const changeLocale = () => {
  setLocale(currentLocale.value)
}

/* ───── Profile form (local state) ───── */
const profileForm = reactive({
  name: '',
  email: '',
})

watchEffect(() => {
  if (!user.value) return
  console.log(user.value)

  profileForm.name = user.value.name
  profileForm.email = user.value.email
})

/* ───── Actions (placeholder for API later) ───── */
const saveProfile = async () => {
  // TODO: llamar API /profile update
  console.log('Saving profile:', profileForm)
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Header mejorado -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent">
          {{ $t('nav.settings') }}
        </h1>
        <p class="text-base-content/60 mt-2 text-lg">
          {{ $t('settings.subtitle') || 'Manage your account settings and preferences' }}
        </p>
      </div>

      <!-- Tabs de navegación (visual, sin funcionalidad adicional) -->
      <div class="tabs tabs-boxed bg-base-200 p-1 rounded-xl inline-flex">
        <a class="tab tab-active gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ $t('settings.general') || 'General' }}
        </a>
        <a class="tab gap-2 opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {{ $t('settings.security') || 'Security' }}
        </a>
        <a class="tab gap-2 opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {{ $t('settings.notifications') || 'Notifications' }}
        </a>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Settings - Más grande -->
        <div class="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-xl">{{ $t('settings.profile') }}</h2>
                <p class="text-sm text-base-content/60">{{ $t('settings.profileDescription') || 'Update your personal information' }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ $t('settings.fullName') }}
                  </span>
                </label>
                <input
                    v-model="profileForm.name"
                    type="text"
                    class="input input-bordered rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="John Doe"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ $t('settings.email') }}
                  </span>
                </label>
                <input
                    v-model="profileForm.email"
                    type="email"
                    class="input input-bordered rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="you@example.com"
                />
              </div>

              <div class="form-control mt-6">
                <button class="btn btn-primary rounded-xl h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-0 shadow-lg shadow-purple-500/30" @click="saveProfile">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ $t('common.save') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Language & Theme - Lado derecho -->
        <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-lg">{{ $t('settings.appearance') }}</h2>
                <p class="text-xs text-base-content/60">{{ $t('settings.appearanceDescription') || 'Customize your experience' }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    {{ $t('settings.language') }}
                  </span>
                </label>
                <select
                    class="select select-bordered rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    v-model="currentLocale"
                    @change="changeLocale"
                >
                  <option
                      v-for="locale in availableLocales"
                      :key="locale.code"
                      :value="locale.code"
                  >
                    {{ locale.flag }} {{ locale.name }}
                  </option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    {{ $t('settings.theme') }}
                  </span>
                </label>
                <select
                    class="select select-bordered rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    v-model="colorMode.preference"
                >
                  <option value="light">☀️ Light</option>
                  <option value="dark">🌙 Dark</option>
                  <option value="system">💻 System</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences con mejor diseño -->
        <div class="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-xl">{{ $t('settings.preferences') }}</h2>
                <p class="text-sm text-base-content/60">{{ $t('settings.preferencesDescription') || 'Manage your notification settings' }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="form-control">
                <label class="label cursor-pointer p-4 rounded-xl hover:bg-base-200 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span class="label-text font-semibold">Email notifications</span>
                      <p class="text-xs text-base-content/60">Receive updates about your account</p>
                    </div>
                  </div>
                  <input type="checkbox" class="toggle toggle-primary" checked />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer p-4 rounded-xl hover:bg-base-200 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <span class="label-text font-semibold">Marketing emails</span>
                      <p class="text-xs text-base-content/60">Get the latest news and offers</p>
                    </div>
                  </div>
                  <input type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Actions con diseño de alerta -->
        <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-lg">{{ $t('settings.account') }}</h2>
                <p class="text-xs text-base-content/60">{{ $t('settings.accountDescription') || 'Security and account actions' }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <button class="btn btn-outline rounded-xl w-full justify-start gap-3 h-auto py-3 hover:bg-base-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <div class="text-left">
                  <div class="font-semibold">{{ $t('settings.changePassword') }}</div>
                  <div class="text-xs opacity-60">Update your password</div>
                </div>
              </button>

              <div class="divider my-2"></div>

              <div class="alert alert-warning rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="text-xs">This action cannot be undone</span>
              </div>

              <button class="btn btn-outline btn-error rounded-xl w-full justify-start gap-3 h-auto py-3 hover:bg-error hover:text-error-content">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <div class="text-left">
                  <div class="font-semibold">{{ $t('settings.deleteAccount') }}</div>
                  <div class="text-xs opacity-60">Permanently delete your account</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>