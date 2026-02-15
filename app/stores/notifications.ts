import { defineStore } from 'pinia'
import type { Notification, NotificationState } from '~/types/notification'
import { useApi } from '~/composables/useApi'

export const useNotificationsStore = defineStore('notifications', {
    state: (): NotificationState => ({
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null
    }),

    getters: {
        // Get unread notifications
        unreadNotifications: (state) => {
            return state.notifications.filter(n => !n.read)
        },

        // Get read notifications
        readNotifications: (state) => {
            return state.notifications.filter(n => n.read)
        },

        // Get recent notifications (last 5)
        recentNotifications: (state) => {
            return state.notifications.slice(0, 5)
        },

        // Check if there are unread notifications
        hasUnread: (state) => {
            return state.unreadCount > 0
        }
    },

    actions: {
        /**
         * Fetch all notifications
         */
        async fetchNotifications() {
            const auth = useAuthStore()
            if (!auth.token) return
            if (this.loading) return

            this.loading = true
            this.error = null

            try {
                // ✅ Usar useApi() directamente, NO useNotifications()
                const response = await useApi().fetchNotifications(auth.token)

                this.notifications = response.data || []
                this.unreadCount = this.notifications.filter(n => !n.read).length
            } catch (error: any) {
                this.error = error.message || 'Failed to fetch notifications'
                console.error('Error fetching notifications:', error)
            } finally {
                this.loading = false
            }
        },

        /**
         * Mark a single notification as read
         */
        async markAsRead(notificationId: number) {
            const auth = useAuthStore()
            if (!auth.token) return

            try {
                const response = await useApi().markNotificationAsRead(auth.token, notificationId)

                // Update notification in store
                const index = this.notifications.findIndex(n => n.id === notificationId)
                if (index !== -1) {
                    this.notifications[index] = response.data
                    this.unreadCount = Math.max(0, this.unreadCount - 1)
                }
            } catch (error: any) {
                console.error('Error marking notification as read:', error)
                throw error
            }
        },

        /**
         * Mark all notifications as read
         */
        async markAllAsRead() {
            const auth = useAuthStore()
            if (!auth.token) return

            try {
                await useApi().markAllNotificationsAsRead(auth.token)

                // Update all notifications in store
                this.notifications = this.notifications.map(n => ({
                    ...n,
                    read: true,
                    read_at: new Date().toISOString()
                }))

                this.unreadCount = 0
            } catch (error: any) {
                console.error('Error marking all notifications as read:', error)
                throw error
            }
        },

        /**
         * Add a new notification (for real-time updates)
         */
        addNotification(notification: Notification) {
            this.notifications.unshift(notification)
            if (!notification.read) {
                this.unreadCount++
            }
        },

        /**
         * Remove a notification
         */
        removeNotification(notificationId: number) {
            const notification = this.notifications.find(n => n.id === notificationId)
            if (notification && !notification.read) {
                this.unreadCount--
            }
            this.notifications = this.notifications.filter(n => n.id !== notificationId)
        },

        /**
         * Clear all notifications
         */
        clearNotifications() {
            this.notifications = []
            this.unreadCount = 0
        }
    }
})