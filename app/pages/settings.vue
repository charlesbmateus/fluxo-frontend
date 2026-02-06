<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold">{{ $t('nav.settings') }}</h1>
        <p class="text-base-content/60 mt-1">Manage your account preferences</p>
      </div>

      <!-- Settings Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Profile Settings -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Profile Settings</h2>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Full Name</span>
              </label>
              <input type="text" placeholder="Your name" class="input input-bordered" value="John Doe" />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input type="email" placeholder="email@example.com" class="input input-bordered" value="john@example.com" />
            </div>
            <div class="form-control mt-4">
              <button class="btn btn-primary">{{ $t('common.save') }}</button>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Preferences</h2>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Email Notifications</span>
                <input type="checkbox" class="toggle toggle-primary" checked />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Marketing Emails</span>
                <input type="checkbox" class="toggle toggle-primary" />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">SMS Notifications</span>
                <input type="checkbox" class="toggle toggle-primary" checked />
              </label>
            </div>
          </div>
        </div>

        <!-- Language & Theme -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Appearance</h2>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Language</span>
              </label>
              <select class="select select-bordered" v-model="currentLocale" @change="changeLocale">
                <option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
                  {{ locale.name }}
                </option>
              </select>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Theme</span>
              </label>
              <select class="select select-bordered" v-model="colorMode.preference">
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
            <h2 class="card-title">Account Actions</h2>
            <button class="btn btn-outline">Change Password</button>
            <button class="btn btn-outline btn-warning">Export Data</button>
            <button class="btn btn-outline btn-error">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const colorMode = useColorMode()

const currentLocale = ref(locale.value)

const availableLocales = computed(() => {
  return locales.value
})

const changeLocale = () => {
  setLocale(currentLocale.value)
}
</script>
