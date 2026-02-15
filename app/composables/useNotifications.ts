import { useNotificationsStore } from '~/stores/notifications'
import type { Notification } from '~/types/notification'

export const useNotifications = () => {
    const store = useNotificationsStore()

    /**
     * Fetch notifications on mount
     */
    const fetchNotifications = async () => {
        await store.fetchNotifications()
    }

    /**
     * Mark notification as read
     */
    const markAsRead = async (notificationId: number) => {
        await store.markAsRead(notificationId)
    }

    /**
     * Mark all as read
     */
    const markAllAsRead = async () => {
        await store.markAllAsRead()
    }

    /**
     * Get notification icon based on type
     */
    const getNotificationIcon = (type: string) => {
        const icons: Record<string, string> = {
            'booking': '📅',
            'payment': '💰',
            'review': '⭐',
            'message': '💬',
            'service': '🛠️',
            'system': '🔔',
            'default': '🔔'
        }
        return icons[type] || icons['default']
    }

    /**
     * Get notification color based on type
     */
    const getNotificationColor = (type: string) => {
        const colors: Record<string, string> = {
            'booking': 'info',
            'payment': 'success',
            'review': 'warning',
            'message': 'primary',
            'service': 'secondary',
            'system': 'accent'
        }
        return colors[type] || 'primary'
    }

    /**
     * Format notification time (relative)
     */
    const formatNotificationTime = (dateString: string) => {
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
     * Get notification badge variant
     */
    const getNotificationBadge = (type: string) => {
        const badges: Record<string, string> = {
            'booking': 'badge-info',
            'payment': 'badge-success',
            'review': 'badge-warning',
            'message': 'badge-primary',
            'service': 'badge-secondary',
            'system': 'badge-accent'
        }
        return badges[type] || 'badge-primary'
    }

    return {
        // State
        notifications: computed(() => store.notifications),
        unreadNotifications: computed(() => store.unreadNotifications),
        readNotifications: computed(() => store.readNotifications),
        recentNotifications: computed(() => store.recentNotifications),
        unreadCount: computed(() => store.unreadCount),
        hasUnread: computed(() => store.hasUnread),
        loading: computed(() => store.loading),
        error: computed(() => store.error),

        // Actions
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        addNotification: store.addNotification,
        removeNotification: store.removeNotification,
        clearNotifications: store.clearNotifications,

        // Helpers
        getNotificationIcon,
        getNotificationColor,
        formatNotificationTime,
        getNotificationBadge
    }
}