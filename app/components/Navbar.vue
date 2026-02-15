<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const colorMode = useColorMode()
const { user, isAuthenticated, logout } = useAuth()
const router = useRouter()

const props = defineProps<{
  showDrawerToggle?: boolean
  isDrawerOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-drawer'): void
}>()

const availableLocales = computed(() => {
  return locales.value
})

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const handleLogout = async () => {
  await logout()
  await router.push('/login')
}
</script>

<template>
  <div class="navbar bg-base-100 shadow-md">
    <div class="container mx-auto py-3 flex items-center justify-between">
      <!-- Toggle drawer btn -->
      <div v-if="showDrawerToggle && isAuthenticated" class="flex-none hidden lg:flex">
        <button @click="emit('toggle-drawer')" class="btn btn-square btn-ghost">
          <svg v-if="isDrawerOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <!-- Logo -->
      <NuxtLink class="flex items-center gap-2" to="/">
        <h1 class="text-xl font-bold bg-gradient-to-r from-purple-600  to-yellow-500 bg-clip-text text-transparent">
          Fluxo Marketplace
        </h1>
      </NuxtLink>

      <!-- Language & Theme Controls -->
      <div class="flex items-center gap-1">
        <!-- Notifications with Indicator -->
        <div v-if="isAuthenticated" class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <div class="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span class="badge badge-xs badge-primary indicator-item">3</span>
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-80">
            <li class="menu-title">
              <span>Notifications</span>
            </li>
            <li>
              <a class="flex flex-col items-start">
                <span class="font-semibold">New service request</span>
                <span class="text-xs opacity-50">John Doe requested your service</span>
              </a>
            </li>
            <li>
              <a class="flex flex-col items-start">
                <span class="font-semibold">Payment received</span>
                <span class="text-xs opacity-50">You received $150 for Web Development</span>
              </a>
            </li>
            <li>
              <a class="flex flex-col items-start">
                <span class="font-semibold">Review posted</span>
                <span class="text-xs opacity-50">Jane Smith left you a 5-star review</span>
              </a>
            </li>
            <li class="mt-2">
              <a href="#" class="btn btn-sm btn-block">View All</a>
            </li>
          </ul>
        </div>

        <!-- Messages with Indicator -->
        <div v-if="isAuthenticated" class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <div class="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span class="badge badge-xs badge-primary indicator-item">5</span>
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-80">
            <li class="menu-title">
              <span>Messages</span>
            </li>
            <li>
              <a class="flex items-start gap-3">
                <div class="avatar placeholder">
                  <div class="bg-neutral text-neutral-content rounded-full w-8">
                    <span class="text-xs">JD</span>
                  </div>
                </div>
                <div class="flex flex-col">
                  <span class="font-semibold">John Doe</span>
                  <span class="text-xs opacity-50">Hi, I'm interested in your...</span>
                </div>
              </a>
            </li>
            <li>
              <a class="flex items-start gap-3">
                <div class="avatar placeholder">
                  <div class="bg-neutral text-neutral-content rounded-full w-8">
                    <span class="text-xs">JS</span>
                  </div>
                </div>
                <div class="flex flex-col">
                  <span class="font-semibold">Jane Smith</span>
                  <span class="text-xs opacity-50">Thank you for the great work!</span>
                </div>
              </a>
            </li>
            <li class="mt-2">
              <NuxtLink to="/messages" class="btn btn-sm btn-block">View All Messages</NuxtLink>
            </li>
          </ul>
        </div>
        <!-- Language Selector -->
        <div class="dropdown dropdown-end">
          <label class="btn btn-ghost btn-sm btn-circle" tabindex="0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </label>
          <ul class="dropdown-content z-[1] menu p-2 shadow-lg bg-white dark:bg-gray-800 rounded-xl w-52 mt-3 border border-gray-200 dark:border-gray-700"
              tabindex="0">
            <li v-for="loc in locales" :key="loc.code">
              <a
                  :class="{ 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400': locale === loc.code }"
                  class="flex items-center gap-2"
                  @click="locale = loc.code"
              >
                <span class="text-xl">{{ loc.flag }}</span>
                <span>{{ loc.name }}</span>
                <svg v-if="locale === loc.code" class="w-4 h-4 ml-auto" fill="none" stroke="currentColor"
                     stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m4.5 12.75 6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>

        <!-- Theme Toggle -->
        <button
            :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'" :checked="colorMode.preference === 'dark'"
            class="btn btn-ghost btn-sm btn-circle"
            @click="toggleTheme"
        >
          <!-- Sun icon for light mode -->
          <svg v-if="colorMode.value === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor"
               stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
          <!-- Moon icon for dark mode -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- User Menu -->
        <div v-if="isAuthenticated" class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full bg-primary text-white flex items-center justify-center">
              <span>{{ user?.name?.charAt(0) || 'U' }}</span>
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Profile</a></li>
            <li><NuxtLink to="/settings">Settings</NuxtLink></li>
            <li><a @click="handleLogout">{{ $t('auth.logout') }}</a></li>
          </ul>
        </div>

        <!-- Login/Register Buttons -->
        <div v-else class="flex gap-2">
          <NuxtLink to="/login" class="btn btn-ghost btn-sm">{{ $t('auth.login') }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
