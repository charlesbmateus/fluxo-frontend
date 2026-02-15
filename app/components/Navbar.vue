<script setup lang="ts">
const { locale, locales } = useI18n()
const colorMode = useColorMode()
const { user, isAuthenticated, logout } = useAuth()
const router = useRouter()

// Notifications
const {
  recentNotifications,
  unreadCount: notificationsUnreadCount,
  hasUnread: hasUnreadNotifications,
  loading: notificationsLoading,
  fetchNotifications,
  markAsRead: markNotificationAsRead,
  markAllAsRead: markAllNotificationsAsRead,
  formatNotificationTime,
  getNotificationIcon
} = useNotifications()

// Conversations
const {
  recentConversations,
  unreadCount: messagesUnreadCount,
  hasUnread: hasUnreadMessages,
  loading: conversationsLoading,
  fetchConversations,
  markAsRead: markConversationAsRead,
  formatMessageTime,
  getSenderInitials,
  truncateMessage,
  getLastMessage
} = useConversations()

const props = defineProps<{
  showDrawerToggle?: boolean
  isDrawerOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-drawer'): void
}>()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const handleLogout = async () => {
  await logout()
  await router.push('/login')
}

// Fetch data on mount
onMounted(() => {
  if (isAuthenticated.value) {
    fetchNotifications()
    fetchConversations()
  }
})

// Handle notification click
const handleNotificationClick = async (notificationId: number) => {
  await markNotificationAsRead(notificationId)
}

// Handle mark all notifications as read
const handleMarkAllNotificationsAsRead = async () => {
  await markAllNotificationsAsRead()
}

// Handle conversation click
const handleConversationClick = async (conversationId: number) => {
  await markConversationAsRead(conversationId)
  await router.push('/messages')
}
</script>

<template>
  <div class="navbar bg-base-100 shadow-md">
    <div class="container min-w-full py-3 flex items-center justify-between">

      <div v-if="showDrawerToggle && isAuthenticated" class="flex-none lg:hidden">
        <label for="main-drawer" class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>

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
      <NuxtLink :to="isAuthenticated ? '/dashboard' : '/'" class="flex items-center gap-2">
        <h1 class="text-xl font-bold bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent">
          Fluxo
        </h1>
      </NuxtLink>

      <!-- Right Side Controls -->
      <div class="flex items-center gap-1">
        <!-- Notifications Dropdown -->
        <div v-if="isAuthenticated" class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <div class="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span v-if="hasUnreadNotifications" class="badge badge-xs badge-primary indicator-item">{{ notificationsUnreadCount }}</span>
            </div>
          </label>
          <div tabindex="0" class="dropdown-content mt-3 z-[1] shadow-xl bg-base-100 rounded-box w-96 border border-base-300">
            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-base-300">
              <h3 class="font-semibold text-base">{{ $t('notifications.title') || 'Notifications' }}</h3>
              <button
                  v-if="hasUnreadNotifications"
                  @click="handleMarkAllNotificationsAsRead"
                  class="text-xs text-primary hover:underline font-medium"
              >
                {{ $t('notifications.markAllRead') || 'Mark all as read' }}
              </button>
            </div>

            <!-- Loading State -->
            <div v-if="notificationsLoading" class="flex items-center justify-center py-8">
              <span class="loading loading-spinner loading-md"></span>
            </div>

            <!-- Notifications List -->
            <div v-else class="max-h-96 overflow-y-auto">
              <!-- Notification Items -->
              <div
                  v-for="notification in recentNotifications"
                  :key="notification.id"
                  @click="handleNotificationClick(notification.id)"
                  class="flex items-start gap-3 p-4 hover:bg-base-200 cursor-pointer transition-colors border-b border-base-300 last:border-b-0"
                  :class="{ 'bg-primary/5': !notification.read }"
              >
                <!-- Icon -->
                <div class="text-2xl flex-shrink-0 mt-1">
                  {{ getNotificationIcon(notification.type) }}
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h4 class="font-semibold text-sm truncate">{{ notification.title }}</h4>
                    <span v-if="!notification.read" class="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></span>
                  </div>
                  <p class="text-xs text-base-content/70 line-clamp-2 mb-1">{{ notification.message }}</p>
                  <span class="text-xs text-base-content/50">{{ formatNotificationTime(notification.created_at) }}</span>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="recentNotifications.length === 0" class="flex flex-col items-center justify-center py-12 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p class="text-sm text-base-content/60 font-medium mb-1">{{ $t('notifications.noNotifications') || 'No notifications yet' }}</p>
                <p class="text-xs text-base-content/40">{{ $t('notifications.noNotificationsDescription') || 'We\'ll notify you when something arrives' }}</p>
              </div>
            </div>

            <!-- Footer - View All -->
            <div v-if="recentNotifications.length > 0" class="p-3 border-t border-base-300">
              <NuxtLink
                  to="/notifications"
                  class="btn btn-ghost btn-sm btn-block normal-case"
              >
                {{ $t('notifications.viewAll') || 'View All Notifications' }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Messages Dropdown with Real Data -->
        <div v-if="isAuthenticated" class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <div class="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span v-if="hasUnreadMessages" class="badge badge-xs badge-primary indicator-item">{{ messagesUnreadCount }}</span>
            </div>
          </label>
          <div tabindex="0" class="dropdown-content mt-3 z-[1] shadow-xl bg-base-100 rounded-box w-96 border border-base-300">
            <!-- Header -->
            <div class="px-4 py-3 border-b border-base-300">
              <h3 class="font-semibold text-base">{{ $t('messages.title') || 'Messages' }}</h3>
            </div>

            <!-- Loading State -->
            <div v-if="conversationsLoading" class="flex items-center justify-center py-8">
              <span class="loading loading-spinner loading-md"></span>
            </div>

            <!-- Messages List -->
            <div v-else class="max-h-96 overflow-y-auto">
              <!-- Message Items -->
              <div
                  v-for="conversation in recentConversations"
                  :key="conversation.id"
                  @click="handleConversationClick(conversation.id)"
                  class="flex items-start gap-3 p-4 hover:bg-base-200 cursor-pointer transition-colors border-b border-base-300 last:border-b-0"
              >
                <!-- Avatar -->
                <div class="avatar placeholder flex-shrink-0">
                  <div class="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-full w-10">
                    <span class="text-xs font-semibold">{{ getSenderInitials(getLastMessage(conversation.id)?.sender.name || 'User') }}</span>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-baseline justify-between gap-2 mb-1">
                    <h4 class="font-semibold text-sm truncate">{{ getLastMessage(conversation.id)?.sender.name }}</h4>
                    <span class="text-xs text-base-content/50 flex-shrink-0">{{ formatMessageTime(getLastMessage(conversation.id)?.created_at || '') }}</span>
                  </div>
                  <p class="text-xs text-base-content/70 truncate">{{ truncateMessage(getLastMessage(conversation.id)?.content || '') }}</p>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="recentConversations.length === 0" class="flex flex-col items-center justify-center py-12 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p class="text-sm text-base-content/60 font-medium mb-1">{{ $t('messages.noMessages') || 'No messages yet' }}</p>
                <p class="text-xs text-base-content/40">{{ $t('messages.noMessagesDescription') || 'Start a conversation' }}</p>
              </div>
            </div>

            <!-- Footer - View All -->
            <div v-if="recentConversations.length > 0" class="p-3 border-t border-base-300">
              <NuxtLink to="/messages" class="btn btn-ghost btn-sm btn-block normal-case">
                {{ $t('messages.viewAll') || 'View All Messages' }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Language Selector -->
        <div class="dropdown dropdown-end">
          <label class="btn btn-ghost btn-sm btn-circle" tabindex="0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </label>
          <ul class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-xl w-52 mt-3 border border-base-300" tabindex="0">
            <li v-for="loc in locales" :key="loc.code">

              :class="{ 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400': locale === loc.code }"
              class="flex items-center gap-2"
              @click="locale = loc.code"
              >
              <span class="text-xl">{{ loc.flag }}</span>
              <span>{{ loc.name }}</span>
              <svg v-if="locale === loc.code" class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="m4.5 12.75 6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </li>
          </ul>
        </div>

        <!-- Theme Toggle -->
        <button
            :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            class="btn btn-ghost btn-sm btn-circle"
            @click="toggleTheme"
        >
          <svg v-if="colorMode.value === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- User Menu -->
        <div v-if="isAuthenticated" class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center font-semibold">
              <span>{{ user?.name?.charAt(0).toUpperCase() || 'U' }}</span>
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><NuxtLink to="/profile">{{ $t('nav.profile') || 'Profile' }}</NuxtLink></li>
            <li><NuxtLink to="/settings">{{ $t('nav.settings') || 'Settings' }}</NuxtLink></li>
            <li><a @click="handleLogout">{{ $t('auth.logout') || 'Logout' }}</a></li>
          </ul>
        </div>

        <!-- Login/Register Buttons -->
        <div v-else class="flex gap-2">
          <NuxtLink to="/login" class="btn btn-ghost btn-sm">{{ $t('auth.login') || 'Login' }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>