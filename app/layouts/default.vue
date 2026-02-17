<script setup lang="ts">
const { isAuthenticated } = useAuth()

const isDrawerOpen = ref(true)

const containerClasses = computed(() => [
  'min-h-screen',
  isAuthenticated.value ? 'drawer lg:drawer-open' : '',
  {
    'is-drawer-open': isDrawerOpen.value && isAuthenticated.value,
    'is-drawer-close': !isDrawerOpen.value && isAuthenticated.value
  }
])

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}
</script>

<template>
  <div :class="containerClasses">
    <input v-if="isAuthenticated" id="main-drawer" type="checkbox" class="drawer-toggle" />
    
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <Navbar
        :show-drawer-toggle="true"
        :is-drawer-open="isDrawerOpen"
        @toggle-drawer="toggleDrawer"
      />

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
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span v-if="isDrawerOpen">{{ $t('nav.dashboard') }}</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/marketplace" class="flex items-center" :class="isDrawerOpen ? 'gap-3' : 'justify-center tooltip tooltip-right'" :data-tip="isDrawerOpen ? '' : $t('nav.marketplace')">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span v-if="isDrawerOpen">{{ $t('nav.marketplace') }}</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/messages" class="flex items-center" :class="isDrawerOpen ? 'gap-3' : 'justify-center tooltip tooltip-right'" :data-tip="isDrawerOpen ? '' : $t('nav.messages')">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span v-if="isDrawerOpen">{{ $t('nav.messages') }}</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/settings" class="flex items-center" :class="isDrawerOpen ? 'gap-3' : 'justify-center tooltip tooltip-right'" :data-tip="isDrawerOpen ? '' : $t('nav.settings')">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span v-if="isDrawerOpen">{{ $t('nav.settings') }}</span>
            </NuxtLink>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
