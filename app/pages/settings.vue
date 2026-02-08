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
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold">{{ $t('nav.settings') }}</h1>
        <p class="text-base-content/60 mt-1">
          {{ $t('settings.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Profile Settings -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">{{ $t('settings.profile') }}</h2>

            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ $t('settings.fullName') }}</span>
              </label>
              <input
                  v-model="profileForm.name"
                  type="text"
                  class="input input-bordered"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ $t('settings.email') }}</span>
              </label>
              <input
                  v-model="profileForm.email"
                  type="email"
                  class="input input-bordered"
              />
            </div>

            <div class="form-control mt-4">
              <button class="btn btn-primary" @click="saveProfile">
                {{ $t('common.save') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">{{ $t('settings.preferences') }}</h2>

            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Email notifications</span>
                <input type="checkbox" class="toggle toggle-primary" checked />
              </label>
            </div>

            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Marketing emails</span>
                <input type="checkbox" class="toggle toggle-primary" />
              </label>
            </div>
          </div>
        </div>

        <!-- Language & Theme -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">{{ $t('settings.appearance') }}</h2>

            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ $t('settings.language') }}</span>
              </label>
              <select
                  class="select select-bordered"
                  v-model="currentLocale"
                  @change="changeLocale"
              >
                <option
                    v-for="locale in availableLocales"
                    :key="locale.code"
                    :value="locale.code"
                >
                  {{ locale.name }}
                </option>
              </select>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ $t('settings.theme') }}</span>
              </label>
              <select
                  class="select select-bordered"
                  v-model="colorMode.preference"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">{{ $t('settings.account') }}</h2>

            <button class="btn btn-outline">
              {{ $t('settings.changePassword') }}
            </button>

            <button class="btn btn-outline btn-error">
              {{ $t('settings.deleteAccount') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>