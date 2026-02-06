<template>
  <div class="navbar bg-base-100">
    <!-- Navbar Start - Left Side -->
    <div class="navbar-start">
      <!-- Mobile Menu Button -->
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost btn-circle lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><NuxtLink to="/">{{ $t('nav.dashboard') }}</NuxtLink></li>
          <li><NuxtLink to="/marketplace">{{ $t('nav.marketplace') }}</NuxtLink></li>
          <li><NuxtLink to="/messages">{{ $t('nav.messages') }}</NuxtLink></li>
          <li><NuxtLink to="/settings">{{ $t('nav.settings') }}</NuxtLink></li>
        </ul>
      </div>
      
      <!-- Desktop Menu Items -->
      <div class="hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><NuxtLink to="/">{{ $t('nav.dashboard') }}</NuxtLink></li>
          <li><NuxtLink to="/marketplace">{{ $t('nav.marketplace') }}</NuxtLink></li>
        </ul>
      </div>
    </div>
    
    <!-- Navbar Center - Logo -->
    <div class="navbar-center">
      <NuxtLink to="/" class="btn btn-ghost text-xl">
        <span class="text-primary">Fluxo</span>
        <span class="text-secondary">Marketplace</span>
      </NuxtLink>
    </div>
    
    <!-- Navbar End - Right Side -->
    <div class="navbar-end gap-2">
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
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-32">
          <li v-for="locale in availableLocales" :key="locale.code">
            <a @click="setLocale(locale.code)">{{ locale.name }}</a>
          </li>
        </ul>
      </div>

      <!-- Theme Toggle -->
      <label class="swap swap-rotate btn btn-ghost btn-circle">
        <input type="checkbox" @change="toggleTheme" :checked="colorMode.preference === 'dark'" />
        <svg class="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
        </svg>
        <svg class="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
        </svg>
      </label>

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
        <NuxtLink to="/register" class="btn btn-primary btn-sm">{{ $t('auth.register') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const colorMode = useColorMode()
const { user, isAuthenticated, logout } = useAuth()
const router = useRouter()

const availableLocales = computed(() => {
  return locales.value
})

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>
