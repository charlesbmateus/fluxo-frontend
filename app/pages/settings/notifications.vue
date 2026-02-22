<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()

/* ───── Notification preferences (local state) ───── */
const notifications = reactive({
  emailNotifications: true,
  marketingEmails: false,
  bookingUpdates: true,
  messageAlerts: true,
  pushNotifications: false,
  weeklyDigest: false,
})

/* ───── Actions (placeholder for API later) ───── */
const saveNotifications = async () => {
  // TODO: call API /notifications/preferences update
  console.log('Saving notifications:', notifications)
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
        <NuxtLink to="/settings/notifications" class="tab tab-active gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {{ $t('settings.notifications') }}
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Email Notifications -->
        <div class="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-xl">{{ $t('settings.emailPreferences') }}</h2>
                <p class="text-sm text-base-content/60">{{ $t('settings.emailPreferencesDesc') }}</p>
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
                      <span class="label-text font-semibold">{{ $t('settings.emailNotifications') }}</span>
                      <p class="text-xs text-base-content/60">{{ $t('settings.emailNotificationsDesc') }}</p>
                    </div>
                  </div>
                  <input v-model="notifications.emailNotifications" type="checkbox" class="toggle toggle-primary" />
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
                      <span class="label-text font-semibold">{{ $t('settings.marketingEmails') }}</span>
                      <p class="text-xs text-base-content/60">{{ $t('settings.marketingEmailsDesc') }}</p>
                    </div>
                  </div>
                  <input v-model="notifications.marketingEmails" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer p-4 rounded-xl hover:bg-base-200 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span class="label-text font-semibold">{{ $t('settings.bookingUpdates') }}</span>
                      <p class="text-xs text-base-content/60">{{ $t('settings.bookingUpdatesDesc') }}</p>
                    </div>
                  </div>
                  <input v-model="notifications.bookingUpdates" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer p-4 rounded-xl hover:bg-base-200 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <span class="label-text font-semibold">{{ $t('settings.messageAlerts') }}</span>
                      <p class="text-xs text-base-content/60">{{ $t('settings.messageAlertsDesc') }}</p>
                    </div>
                  </div>
                  <input v-model="notifications.messageAlerts" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Notifications -->
        <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 class="card-title text-lg">{{ $t('settings.otherNotifications') }}</h2>
                <p class="text-xs text-base-content/60">{{ $t('settings.otherNotificationsDesc') }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="form-control">
                <label class="label cursor-pointer p-4 rounded-xl hover:bg-base-200 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span class="label-text font-semibold">{{ $t('settings.pushNotifications') }}</span>
                      <p class="text-xs text-base-content/60">{{ $t('settings.pushNotificationsDesc') }}</p>
                    </div>
                  </div>
                  <input v-model="notifications.pushNotifications" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer p-4 rounded-xl hover:bg-base-200 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <span class="label-text font-semibold">{{ $t('settings.weeklyDigest') }}</span>
                      <p class="text-xs text-base-content/60">{{ $t('settings.weeklyDigestDesc') }}</p>
                    </div>
                  </div>
                  <input v-model="notifications.weeklyDigest" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button class="btn btn-primary rounded-xl h-12 px-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-0 shadow-lg shadow-purple-500/30" @click="saveNotifications">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ $t('settings.savePreferences') }}
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>
