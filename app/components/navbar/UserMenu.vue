<!-- components/navbar/UserMenu.vue -->
<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full bg-primary text-white flex items-center justify-center">
        <span>{{ user?.name?.charAt(0) || 'U' }}</span>
      </div>
    </label>

    <ul tabindex="0"
        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
      <li><a>Profile</a></li>
      <li><NuxtLink to="/settings">Settings</NuxtLink></li>
      <li><a @click="handleLogout">{{ $t('auth.logout') }}</a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { user, logout } = authStore
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>