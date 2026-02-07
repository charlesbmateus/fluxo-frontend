<!-- components/navbar/NavbarGuestActions.vue -->
<template>
  <div class="flex items-center gap-2">
    <NuxtLink to="/marketplace" class="btn btn-ghost font-normal">
      {{ $t('nav.marketplace') }}
    </NuxtLink>

    <LanguageSelector />
    <ThemeToggle />

    <NuxtLink to="/login" class="btn btn-ghost btn-sm">
      {{ $t('auth.login') }} / {{ $t('auth.register') }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import LanguageSelector from './LanguageSelector.vue'
import ThemeToggle from './ThemeToggle.vue'
</script>