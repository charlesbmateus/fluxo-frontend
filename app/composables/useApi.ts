// composables/useApi.ts
import type {ApiResponse, PaginatedResponse} from '~/types/api'
import type {Service} from '~/types/service'
import type {Category} from '~/types/category'
import type {User} from '~/types/auth'
import type {LoginResponse} from '~/types/auth'
import type { Conversation, Message } from '~/types/chat'
import type { Notification } from '~/types/notification'
import type {DashboardData} from "~/types/dashboard";

interface AuthPayload {
    email: string
    password: string
}

interface AuthData {
    token: string
    user: User
}

export const useApi = () => {
    const config = useRuntimeConfig()

    const baseURL: string =
        (config.public.apiBase as string) || 'http://localhost:8000/api'

    // ───────── SERVICES ─────────
    const fetchServices = async (
        page = 1
    ): Promise<ApiResponse<PaginatedResponse<Service>>> => {
        return await $fetch(`/services?page=${page}`, {baseURL})
    }

    // ───────── CATEGORIES ─────────
    const fetchCategories = async (): Promise<ApiResponse<Category[]>> => {
        return await $fetch('/categories', {baseURL})
    }

    // ───────── AUTH ─────────
    const login = async (
        email: string,
        password: string
    ): Promise<LoginResponse> => {
        return await $fetch('/login', {
            method: 'POST',
            body: {email, password},
            baseURL,
        })
    }

    const register = async (payload: {
        name: string
        email: string
        password: string
        password_confirmation: string
    }): Promise<LoginResponse> => {
        return await $fetch('/register', {
            method: 'POST',
            body: payload,
            baseURL,
        })
    }

    const fetchMe = async (token: string): Promise<User> => {
        const response = await $fetch<{
            success: boolean
            message: string
            data: User
        }>('/v1/me', {
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return response.data
    }

    const logout = async (token: string): Promise<void> => {
        await $fetch('/logout', {
            method: 'POST',
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }

    // ───────── CHAT ─────────
    const fetchConversations = async (
        token: string,
        page = 1
    ) => {
        return await $fetch(`/v1/conversations?page=${page}`, {
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }

    const fetchConversation = async (
        token: string,
        conversationId: number,
        page = 1
    ) => {
        return await $fetch(`/v1/conversations/${conversationId}?page=${page}`, {
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }

    const sendMessage = async (
        conversationId: number,
        content: string
    ): Promise<Message> => {
        const auth = useAuthStore()

        const response = await $fetch<{
            success: boolean
            data: Message
        }>(`/v1/conversations/${conversationId}/messages`, {
            method: 'POST',
            baseURL,
            headers: {
                Authorization: `Bearer ${auth.token}`,
                Accept: 'application/json',
            },
            body: { content },
        })

        return response.data
    }

    const markConversationAsRead = async (
        conversationId: number
    ): Promise<void> => {
        await $fetch(`/v1/conversations/${conversationId}/read`, {
            method: 'PATCH',
            baseURL,
        })
    }

    // ───────── NOTIFICATIONS ─────────
    const fetchNotifications = async (token: string) => {
        return await $fetch<{
            success: boolean
            message: string
            data: Notification[]
        }>('/v1/notifications', {
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    const markNotificationAsRead = async (token: string, notificationId: number) => {
        return await $fetch<{
            success: boolean
            message: string
            data: Notification
        }>(`/v1/notifications/${notificationId}/read`, {
            method: 'PATCH',
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    const markAllNotificationsAsRead = async (token: string) => {
        return await $fetch<{
            success: boolean
            message: string
            data: { updated: number }
        }>('/v1/notifications/mark-all-read', {
            method: 'PATCH',
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    // ───────── DASHBOARD ─────────
    const fetchDashboardData = async (token: string) => {
        return await $fetch<{
            success: boolean
            message: string
            data: DashboardData
        }>('/v1/dashboard/provider', {
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    return {
        // data
        fetchServices,
        fetchCategories,

        // auth
        login,
        register,
        fetchMe,
        logout,

        // chat
        fetchConversations,
        fetchConversation,
        sendMessage,
        markConversationAsRead,

        // notifications
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        // dashboard
        fetchDashboardData
    }
}