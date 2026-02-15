export interface Notification {
    id: number
    user_id: number
    type: string
    title: string
    message: string
    data?: Record<string, any>
    read: boolean
    read_at?: string
    created_at: string
    updated_at: string
}

export interface NotificationState {
    notifications: Notification[]
    unreadCount: number
    loading: boolean
    error: string | null
}