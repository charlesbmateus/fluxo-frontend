<!-- components/navbar/NavbarUserActions.vue -->
<template>
  <div class="flex items-center gap-2">
    <NotificationsMenu />
    <MessagesMenu />
    <LanguageSelector />
    <ThemeToggle />
    <UserMenu />
  </div>
</template>

<script setup lang="ts">
import NotificationsMenu from './NotificationsMenu.vue'
import MessagesMenu from './MessagesMenu.vue'
import LanguageSelector from './LanguageSelector.vue'
import ThemeToggle from './ThemeToggle.vue'
import UserMenu from './UserMenu.vue'
</script>