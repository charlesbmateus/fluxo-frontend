<script lang="ts" setup>
import type {Conversation} from '~/types/chat'
import {storeToRefs} from 'pinia'
import {useConversationsStore} from '~/stores/conversations'
import {useAuthStore} from '~/stores/auth'

const conversationsStore = useConversationsStore()
const authStore = useAuthStore()

const {
  conversations,
  activeConversation,
  messages,
  loading
} = storeToRefs(conversationsStore)

const {user} = storeToRefs(authStore)

const newMessage = ref('')
const searchQuery = ref('')
const showMobileChat = ref(false)

onMounted(async () => {
  await conversationsStore.resetConversations()
  await conversationsStore.fetchConversations()
  scrollToBottom()
})

const selectConversation = (conversation: Conversation) => {
  conversationsStore.openConversation(conversation.id)
  showMobileChat.value = true // Show chat on mobile
}

const backToConversations = () => {
  showMobileChat.value = false
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !activeConversation.value) return

  await conversationsStore.sendMessage(newMessage.value)
  newMessage.value = ''

  // Reset textarea height
  nextTick(() => {
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.style.height = 'auto'
    }
  })
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  // If today, show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false})
  }

  // If yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }

  // If within last week
  if (minutes < 10080) { // 7 days
    return date.toLocaleDateString('en-US', {weekday: 'short'})
  }

  // Otherwise show date
  return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
}

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value

  return conversations.value.filter(conv => {
    const lastMessage = conv.messages.at(-1)
    return lastMessage?.sender.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        lastMessage?.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

// Auto-scroll to bottom when new messages arrive
const messagesContainer = ref<HTMLElement>()
watch(messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, {deep: true})

// Scroll to bottom on conversation change
watch(activeConversation, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

const scrollToBottom = () => {
  nextTick(() => {
    requestAnimationFrame(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop =
            messagesContainer.value.scrollHeight
      }
    })
  })
}

const getOtherUser = (conversation: Conversation) => {
  if (!user.value) return null
  return conversation.client_id === user.value.id
      ? conversation.provider
      : conversation.client
}

const handleScroll = async () => {
  if (!messagesContainer.value) return

  if (messagesContainer.value.scrollTop === 0) {
    const previousHeight = messagesContainer.value.scrollHeight

    await conversationsStore.loadMoreMessages()

    nextTick(() => {
      const newHeight = messagesContainer.value!.scrollHeight
      messagesContainer.value!.scrollTop =
          newHeight - previousHeight
    })
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <!-- Compact Header -->
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-base-content">{{ $t('messages.title') }}</h1>
    </div>

    <!-- Main Chat Container - Fixed Height with proper overflow -->
    <div class="w-full rounded-2xl shadow-xl overflow-hidden bg-base-100" style="height: calc(100vh - 200px);">
      <div class="grid grid-cols-1 lg:grid-cols-12 h-full w-full">

        <!-- Conversations Sidebar - Hidden on mobile when chat is open -->
        <div
            :class="{ 'hidden lg:flex': showMobileChat }"
            class="lg:col-span-4 xl:col-span-3 border-r border-base-300 flex flex-col h-full transition-all duration-300"
        >
          <!-- Search Bar -->
          <div class="p-4 border-b border-base-300 bg-base-100 flex-shrink-0">
            <div class="relative">
              <input
                  v-model="searchQuery"
                  :placeholder="$t('messages.searchConversations') || 'Search conversations...'"
                  class="input input-bordered input-sm w-full pl-10"
                  type="text"
              />
              <svg class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2"/>
              </svg>
            </div>
          </div>

          <!-- Conversations List - Scrollable -->
          <div class="flex-1 overflow-y-scroll" style="min-height: 0;">
            <div v-if="loading" class="flex items-center justify-center h-32">
              <span class="loading loading-spinner loading-md"></span>
            </div>

            <div v-else-if="filteredConversations.length === 0"
                 class="flex flex-col items-center justify-center h-32 px-4 text-center">
              <svg class="h-12 w-12 opacity-30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"/>
              </svg>
              <p class="text-sm opacity-60">{{ $t('messages.noConversations') || 'No conversations found' }}</p>
            </div>

            <div
                v-for="conversation in filteredConversations"
                :key="conversation.id"
                :class="{ 'bg-base-200': activeConversation?.id === conversation.id }"
                class="flex items-center gap-3 p-3 cursor-pointer hover:bg-base-200 transition-colors relative"
                @click="selectConversation(conversation)"
            >
              <!-- Avatar -->
              <div class="avatar online">
                <div
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center font-semibold text-lg">
                  {{ conversation.messages.at(-1)?.sender.name.charAt(0).toUpperCase() }}
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-baseline mb-0.5">
                  <p class="font-semibold text-base-content truncate">
                    {{ getOtherUser(conversation)?.name }}
                  </p>
                  <span class="text-xs opacity-50 ml-2 flex-shrink-0">
                    {{ formatTime(conversation.messages.at(-1)?.created_at) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <p class="text-sm opacity-60 truncate pr-2">
                    {{ conversation.messages.at(-1)?.content }}
                  </p>

                  <!-- Unread Badge -->
                  <div
                      v-if="conversation.messages.some(m => !m.read_at)"
                      class="badge badge-primary badge-sm flex-shrink-0"
                  >
                    {{ conversation.messages.filter(m => !m.read_at).length }}
                  </div>
                </div>
              </div>

              <!-- Active Indicator -->
              <div
                  v-if="activeConversation?.id === conversation.id"
                  class="absolute left-0 top-0 bottom-0 w-1 bg-purple-600"
              ></div>
            </div>
          </div>
        </div>

        <!-- Chat Area - Full screen on mobile when active -->
        <div
            :class="{ 'hidden lg:flex': !showMobileChat && !activeConversation }"
            class="lg:col-span-8 xl:col-span-9 flex flex-col h-full bg-base-100"
        >
          <!-- Active Chat -->
          <template v-if="activeConversation">
            <!-- Chat Header with Back Button -->
            <div class="p-4 border-b border-base-300 flex items-center justify-between bg-base-100 flex-shrink-0">
              <div class="flex items-center gap-3">
                <!-- Back Button (Mobile Only) -->
                <button
                    class="btn btn-ghost btn-sm btn-circle lg:hidden"
                    @click="backToConversations"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  </svg>
                </button>

                <div class="avatar online">
                  <div
                      class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center font-semibold">
                    {{
                      activeConversation.messages?.at(-1)?.sender?.name
                          ? activeConversation.messages.at(-1).sender.name.charAt(0).toUpperCase()
                          : '?'
                    }}
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-base-content">
                    {{ getOtherUser(activeConversation)?.name }}
                  </p>
                  <p class="text-xs text-success flex items-center gap-1">
                    <span class="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                    {{ $t('messages.online') || 'Online' }}
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button class="btn btn-ghost btn-sm btn-circle">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"/>
                  </svg>
                </button>
                <button class="btn btn-ghost btn-sm btn-circle">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div style="overflow-y: auto; height: calc(100vh - 350px);">
              <div
                  ref="messagesContainer"
                  class="h-full overflow-y-scroll p-4"
                  @scroll="handleScroll"
              >
                <!-- Messages Content -->
                <div class="space-y-3">
                  <div
                      v-for="message in messages"
                      :key="message.id"
                      :class="[
                      'flex gap-2',
                      message.sender.id === user?.id ? 'justify-end' : 'justify-start'
                    ]"
                  >
                    <!-- Avatar for received messages -->
                    <div
                        v-if="message.sender.id !== user?.id"
                        class="avatar flex-shrink-0"
                    >
                      <div
                          class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center text-xs font-semibold">
                        {{ message.sender.name.charAt(0).toUpperCase() }}
                      </div>
                    </div>

                    <!-- Message Bubble -->
                    <div
                        :class="[
                        'rounded-2xl px-4 py-2 shadow-sm',
                        message.sender.id === user?.id
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-sm max-w-[85%] sm:max-w-[70%]'
                          : 'bg-base-200 text-base-content rounded-bl-sm max-w-[85%] sm:max-w-[70%]'
                      ]"
                    >
                      <!-- Sender name for received messages -->
                      <p
                          v-if="message.sender.id !== user?.id"
                          class="text-xs font-semibold opacity-70 mb-1"
                      >
                        {{ message.sender.name }} ioio
                      </p>

                      <!-- Message content -->
                      <p class="text-sm break-words whitespace-pre-wrap">
                        {{ message.content }}
                      </p>

                      <!-- Timestamp -->
                      <div
                          :class="[
                          'text-xs mt-1 flex items-center gap-1',
                          message.sender.id === user?.id ? 'opacity-70 justify-end' : 'opacity-50'
                        ]"
                      >
                        <span>{{ formatTime(message.created_at) }}</span>
                        <!-- Read receipt for sent messages -->
                        <svg
                            v-if="message.sender.id === user?.id && message.read_at"
                            class="h-4 w-4 text-blue-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                          <path clip-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                fill-rule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="p-3 sm:p-4 border-t border-base-300 bg-base-100 flex-shrink-0">
              <form class="flex gap-2 items-end" @submit.prevent="sendMessage">
                <!-- Attachment Button -->
                <button class="btn btn-ghost btn-sm btn-circle flex-shrink-0" type="button">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"/>
                  </svg>
                </button>

                <!-- Input -->
                <div class="flex-1 relative min-w-0">
                  <textarea
                      v-model="newMessage"
                      :placeholder="$t('messages.typeMessage') || 'Type a message...'"
                      class="textarea textarea-bordered w-full resize-none pr-10 text-sm sm:text-base"
                      rows="1"
                      style="min-height: 40px; max-height: 120px; overflow-y: auto;"
                      @input="(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = 'auto'
                      target.style.height = Math.min(target.scrollHeight, 120) + 'px'
                    }"
                      @keydown.enter.exact.prevent="sendMessage"
                  ></textarea>

                  <!-- Emoji Button -->
                  <button class="btn btn-ghost btn-sm btn-circle absolute right-1 bottom-1" type="button">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"/>
                    </svg>
                  </button>
                </div>

                <!-- Send Button -->
                <button
                    :disabled="!newMessage.trim() || loading"
                    class="btn btn-primary btn-circle flex-shrink-0"
                    type="submit"
                >
                  <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </template>

          <!-- Empty State -->
          <div
              v-else
              class="flex flex-col items-center justify-center h-full text-center px-4"
          >
            <div
                class="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-6">
              <svg class="h-16 w-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('messages.selectConversation') || 'Select a conversation' }}</h3>
            <p class="opacity-60 max-w-sm">
              {{
                $t('messages.selectConversationDescription') || 'Choose a conversation from the list to start messaging'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
/* Custom scrollbar */
.overflow-y-scroll::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.overflow-y-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Smooth textarea resize */
textarea {
  transition: height 0.1s ease;
}

/* Ensure proper scrolling on mobile */
@media (max-width: 1023px) {
  .overflow-y-scroll {
    -webkit-overflow-scrolling: touch;
  }
}
</style>