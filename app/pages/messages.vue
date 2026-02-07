<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold">{{ $t('messages.title') }}</h1>
        <p class="text-base-content/60 mt-1">Stay connected with your clients</p>
      </div>

      <!-- Messages Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-250px)]">
        <!-- Conversations List -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body p-0">
            <div class="p-4 border-b border-base-300">
              <input 
                type="text" 
                placeholder="Search conversations..." 
                class="input input-bordered input-sm w-full"
              />
            </div>
            <div class="overflow-y-auto">
              <div 
                v-for="message in messages" 
                :key="message.id"
                class="flex items-start gap-3 p-4 hover:bg-base-200 cursor-pointer transition-colors border-b border-base-300"
                :class="{ 'bg-base-200': selectedMessage?.id === message.id }"
                @click="selectMessage(message)"
              >
                <div class="avatar">
                  <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                    {{ message.sender.charAt(0) }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start mb-1">
                    <p class="font-semibold truncate">{{ message.sender }}</p>
                    <span class="text-xs text-base-content/60">{{ formatTime(message.timestamp) }}</span>
                  </div>
                  <p class="text-sm text-base-content/60 truncate">{{ message.message }}</p>
                  <div v-if="!message.read" class="badge badge-primary badge-xs mt-1">New</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Window -->
        <div class="lg:col-span-2 card bg-base-100 shadow-xl">
          <div class="card-body p-0 flex flex-col h-full" v-if="selectedMessage">
            <!-- Chat Header -->
            <div class="p-4 border-b border-base-300 flex items-center gap-3">
              <div class="avatar">
                <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {{ selectedMessage.sender.charAt(0) }}
                </div>
              </div>
              <div>
                <p class="font-semibold">{{ selectedMessage.sender }}</p>
                <p class="text-xs text-success flex items-center gap-1">
                  <span class="w-2 h-2 bg-success rounded-full"></span>
                  Online
                </p>
              </div>
            </div>

            <!-- Messages Area -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <!-- Received Message -->
              <div class="chat chat-start">
                <div class="chat-image avatar">
                  <div class="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {{ selectedMessage.sender.charAt(0) }}
                  </div>
                </div>
                <div class="chat-header mb-1">
                  {{ selectedMessage.sender }}
                  <time class="text-xs opacity-50 ml-2">{{ formatTime(selectedMessage.timestamp) }}</time>
                </div>
                <div class="chat-bubble chat-bubble-primary">{{ selectedMessage.message }}</div>
              </div>

              <!-- Sent Message -->
              <div class="chat chat-end">
                <div class="chat-image avatar">
                  <div class="w-10 rounded-full bg-secondary text-white flex items-center justify-center">
                    U
                  </div>
                </div>
                <div class="chat-header mb-1">
                  You
                  <time class="text-xs opacity-50 ml-2">12:46</time>
                </div>
                <div class="chat-bubble chat-bubble-secondary">Thanks! I'll review it and get back to you.</div>
              </div>

              <!-- Another received message -->
              <div class="chat chat-start">
                <div class="chat-image avatar">
                  <div class="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {{ selectedMessage.sender.charAt(0) }}
                  </div>
                </div>
                <div class="chat-header mb-1">
                  {{ selectedMessage.sender }}
                  <time class="text-xs opacity-50 ml-2">12:47</time>
                </div>
                <div class="chat-bubble chat-bubble-primary">Sure, take your time!</div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="p-4 border-t border-base-300">
              <div class="flex gap-2">
                <input 
                  type="text" 
                  :placeholder="$t('messages.typeMessage')" 
                  class="input input-bordered flex-1"
                  v-model="newMessage"
                  @keyup.enter="sendMessage"
                />
                <button class="btn btn-primary" @click="sendMessage">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="card-body flex items-center justify-center h-full">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto text-base-content/30">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <p class="text-base-content/60 mt-4">Select a conversation to start messaging</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Message } from '~/types'

const { fetchMessages } = useApi()

const messages = ref<Message[]>([])
const selectedMessage = ref<Message | null>(null)
const newMessage = ref('')

const selectMessage = (message: Message) => {
  selectedMessage.value = message
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    // In production, send message to API
    console.log('Sending message:', newMessage.value)
    newMessage.value = ''
  }
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  
  if (hours < 1) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else {
    return date.toLocaleDateString()
  }
}

onMounted(async () => {
  const data = await fetchMessages()
  messages.value = data.data
})
</script>
