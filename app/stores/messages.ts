import { defineStore } from 'pinia'
import type { Message } from '~/types'

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    messages: [] as Message[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allMessages: (state) => state.messages,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    
    unreadMessages: (state) => {
      return state.messages.filter(message => !message.read)
    },
    
    unreadCount: (state) => {
      return state.messages.filter(message => !message.read).length
    },
  },

  actions: {
    async fetchMessages() {
      this.loading = true
      this.error = null
      
      try {
        // TODO: Replace with actual API endpoint from fluxo-backend
        // For now, simulating network delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock messages - should be replaced with actual API call to fluxo-backend
        this.messages = [
          {
            id: 1,
            sender: 'John Doe',
            message: 'Hello! I\'m interested in your service.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false
          },
          {
            id: 2,
            sender: 'Jane Smith',
            message: 'Thanks for the quick response!',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: true
          }
        ]
      } catch (err) {
        this.error = 'Failed to fetch messages'
        console.error('Error fetching messages:', err)
      } finally {
        this.loading = false
      }
    },
    
    markAsRead(messageId: number) {
      const message = this.messages.find(m => m.id === messageId)
      if (message) {
        message.read = true
      }
    },
    
    markAllAsRead() {
      this.messages.forEach(message => {
        message.read = true
      })
    },
    
    clearError() {
      this.error = null
    },
  },
})
