import { defineStore } from 'pinia'
import type { Conversation, Message } from '~/types/chat'
import { useApi } from '~/composables/useApi'

export const useConversationsStore = defineStore('conversations', {
    state: () => ({
        conversations: [] as Conversation[],
        activeConversation: null as Conversation | null,
        messages: [] as Message[],
        currentPage: 1 as number,
        lastPage: 1 as number,
        loading: false,
        messagesPage: 1 as number,
        messagesLastPage: 1 as number,
        loadingMessages: false,
    }),

    getters: {
        // Get unread conversations count
        unreadConversationsCount: (state) => {
            return state.conversations.filter(conv =>
                conv.messages.some(msg => !msg.read_at && msg.sender.id !== useAuthStore().user?.id)
            ).length
        },

        // Check if there are unread conversations
        hasUnreadConversations: (state) => {
            return state.conversations.some(conv =>
                conv.messages.some(msg => !msg.read_at && msg.sender.id !== useAuthStore().user?.id)
            )
        },

        // Get recent conversations (first 5)
        recentConversations: (state) => {
            return state.conversations.slice(0, 5)
        },

        // Get last message of a conversation
        getLastMessage: (state) => (conversationId: number) => {
            const conversation = state.conversations.find(c => c.id === conversationId)
            return conversation?.messages[conversation.messages.length - 1]
        }
    },

    actions: {
        async fetchConversations(page = 1) {
            const auth = useAuthStore()
            if (!auth.token) return
            if (this.loading) return
            if (page > this.lastPage) return

            this.loading = true

            try {
                const response = await useApi().fetchConversations(
                    auth.token,
                    page
                )

                const paginated = response.data

                // 🔥 conversaciones reales
                if (page === 1) {
                    this.conversations = paginated.data
                } else {
                    this.conversations.push(...paginated.data)
                }

                // 🔥 SIN meta
                this.currentPage = paginated.current_page
                this.lastPage = paginated.last_page

            } finally {
                this.loading = false
            }
        },

        async openConversation(id: number) {
            const auth = useAuthStore()
            if (!auth.token) return

            this.loadingMessages = true
            this.messagesPage = 1

            try {
                const response = await useApi().fetchConversation(
                    auth.token,
                    id,
                    1
                )

                this.activeConversation = response.data.conversation

                this.messages = response.data.messages.data.reverse()

                this.messagesLastPage = response.data.messages.last_page
                this.messagesPage = response.data.messages.current_page
            } finally {
                this.loadingMessages = false
            }
        },

        async loadMoreMessages() {
            if (this.loadingMessages) return
            if (this.messagesPage >= this.messagesLastPage) return

            const auth = useAuthStore()
            if (!auth.token || !this.activeConversation) return

            this.loadingMessages = true

            try {
                const nextPage = this.messagesPage + 1

                const response = await useApi().fetchConversation(
                    auth.token,
                    this.activeConversation.id,
                    nextPage
                )

                const olderMessages = response.data.messages.data.reverse()

                this.messages.unshift(...olderMessages)

                this.messagesPage = nextPage
            } finally {
                this.loadingMessages = false
            }
        },

        async sendMessage(content: string) {
            if (!this.activeConversation) return

            const api = useApi()

            const message = await api.sendMessage(
                this.activeConversation.id,
                content
            )

            this.messages.push(message)
        },

        async markConversationAsRead(conversationId: number) {
            const auth = useAuthStore()
            if (!auth.token) return

            try {
                await useApi().markConversationAsRead(conversationId)

                // Update conversation in store
                const conversation = this.conversations.find(c => c.id === conversationId)
                if (conversation) {
                    conversation.messages = conversation.messages.map(msg => ({
                        ...msg,
                        read_at: new Date().toISOString()
                    }))
                }
            } catch (error: any) {
                console.error('Error marking conversation as read:', error)
                throw error
            }
        },

        async resetConversations() {
            this.conversations = []
            this.currentPage = 1
            this.lastPage = 1
        }
    },
})