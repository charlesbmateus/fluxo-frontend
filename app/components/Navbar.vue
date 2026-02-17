<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
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
          <svg v-if="isDrawerOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 stroke-current" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 stroke-current" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
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
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-32">
            <li v-for="loc in locales" :key="loc.code">
              <a @click="setLocale(loc.code)">{{ loc.name }}</a>
            </li>
          </ul>
        </div>

        <!-- Theme Toggle -->
        <button
            :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            class="btn btn-ghost btn-sm btn-circle"
            @click="toggleTheme"
        >
          <svg v-if="colorMode.value === 'dark'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
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