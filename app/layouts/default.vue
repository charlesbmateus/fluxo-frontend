<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const colorMode = useColorMode()
const { user, isAuthenticated, logout } = useAuth()
const router = useRouter()

const isDrawerOpen = ref(true)

const containerClasses = computed(() => [
  'min-h-screen',
  isAuthenticated.value ? 'drawer lg:drawer-open' : '',
  {
    'is-drawer-open': isDrawerOpen.value && isAuthenticated.value,
    'is-drawer-close': !isDrawerOpen.value && isAuthenticated.value
  }
])

const availableLocales = computed(() => {
  return locales.value
})

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

const handleLogout = async () => {
  await logout()
  await router.push('/login')
}
</script>

<template>
  <div :class="containerClasses">
    <input v-if="isAuthenticated" id="main-drawer" type="checkbox" class="drawer-toggle" />
    
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <div class="navbar bg-base-100 shadow-md">
        <div v-if="isAuthenticated" class="flex-none lg:hidden">
          <label for="main-drawer" class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>
        <!-- Toggle drawer btn -->
        <div v-if="isAuthenticated" class="flex-none hidden lg:flex">
          <button @click="toggleDrawer" class="btn btn-square btn-ghost">
            <svg v-if="isDrawerOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <div class="flex-1">
          <!-- Logo -->
          <NuxtLink :to="isAuthenticated ? '/dashboard' : '/'" class="flex items-center gap-2">
            <h1 class="text-xl font-bold bg-gradient-to-r from-purple-600  to-yellow-500 bg-clip-text text-transparent">
              Fluxo Marketplace
            </h1>
          </NuxtLink>
        </div>
        <div class="flex-none gap-2">
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
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="flex-1 p-4 lg:p-6">
        <slot />
      </main>
    </div>

    <!-- Sidebar -->
    <div v-if="isAuthenticated" class="drawer-side">
      <label for="main-drawer" class="drawer-overlay"></label>
      <aside class="bg-base-200 min-h-full transition-all duration-300" :class="isDrawerOpen ? 'w-64' : 'w-20'">
        <div class="p-4">
          <div class="flex items-center justify-center py-4">
            <div class="text-center">
              <h2 class="text-2xl font-bold" v-if="isDrawerOpen">
                <span class="bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent font-bold">Fluxo</span>
              </h2>
              <h2 class="text-2xl font-bold" v-else>
                <span class="text-primary">F</span>
              </h2>
              <p class="text-xs text-base-content/60" v-if="isDrawerOpen">Marketplace</p>
            </div>
          </div>
        </div>
        <ul class="menu p-4 space-y-2">
          <li>
            <NuxtLink :to="isAuthenticated ? '/dashboard' : '/'" class="flex items-center" :class="isDrawerOpen ? 'gap-3' : 'justify-center tooltip tooltip-right'" :data-tip="isDrawerOpen ? '' : $t('nav.dashboard')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span v-if="isDrawerOpen">{{ $t('nav.dashboard') }}</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/marketplace" class="flex items-center" :class="isDrawerOpen ? 'gap-3' : 'justify-center tooltip tooltip-right'" :data-tip="isDrawerOpen ? '' : $t('nav.marketplace')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
              <span v-if="isDrawerOpen">{{ $t('nav.marketplace') }}</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/messages" class="flex items-center" :class="isDrawerOpen ? 'gap-3' : 'justify-center tooltip tooltip-right'" :data-tip="isDrawerOpen ? '' : $t('nav.messages')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span v-if="isDrawerOpen">{{ $t('nav.messages') }}</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/settings" class="flex items-center" :class="isDrawerOpen ? 'gap-3' : 'justify-center tooltip tooltip-right'" :data-tip="isDrawerOpen ? '' : $t('nav.settings')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span v-if="isDrawerOpen">{{ $t('nav.settings') }}</span>
            </NuxtLink>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
