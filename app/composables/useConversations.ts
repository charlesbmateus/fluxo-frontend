import { useConversationsStore } from '~/stores/conversations'

export const useConversations = () => {
    const store = useConversationsStore()

    /**
     * Fetch conversations
     */
    const fetchConversations = async (page = 1) => {
        await store.fetchConversations(page)
    }

    /**
     * Open a conversation
     */
    const openConversation = async (id: number) => {
        await store.openConversation(id)
    }

    /**
     * Mark conversation as read
     */
    const markAsRead = async (conversationId: number) => {
        await store.markConversationAsRead(conversationId)
    }

    /**
     * Format message time (relative)
     */
    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`

        return date.toLocaleDateString()
    }

    /**
     * Get sender initials for avatar
     */
    const getSenderInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    /**
     * Truncate message preview
     */
    const truncateMessage = (message: string, maxLength = 50) => {
        if (message.length <= maxLength) return message
        return message.slice(0, maxLength) + '...'
    }

    return {
        // State
        conversations: computed(() => store.conversations),
        recentConversations: computed(() => store.recentConversations),
        unreadCount: computed(() => store.unreadConversationsCount),
        hasUnread: computed(() => store.hasUnreadConversations),
        loading: computed(() => store.loading),
        activeConversation: computed(() => store.activeConversation),

        // Actions
        fetchConversations,
        openConversation,
        markAsRead,
        sendMessage: store.sendMessage,
        resetConversations: store.resetConversations,

        // Helpers
        formatMessageTime,
        getSenderInitials,
        truncateMessage,
        getLastMessage: store.getLastMessage
    }
}