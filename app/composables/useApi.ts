// composables/useApi.ts
import type {ApiResponse, PaginatedResponse} from '~/types/api'
import type {Service} from '~/types/service'
import type {Category} from '~/types/category'
import type {User} from '~/types/auth'
import type {LoginResponse} from '~/types/auth'
import type { Conversation, Message } from '~/types/chat'
import type { Notification } from '~/types/notification'
import type {DashboardData, AvailabilitySlot, BookingRequest, BookingResponse, PaymentIntentResponse, StripeConnectResponse} from "~/types/dashboard";
import type { Invoice } from '~/types/invoice'

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

    // ───────── SERVICES (PUBLIC) ─────────
    const fetchServices = async (
        page = 1
    ): Promise<ApiResponse<PaginatedResponse<Service>>> => {
        return await $fetch(`/v1/services?page=${page}`, {baseURL})
    }

    const fetchService = async (
        serviceId: number
    ): Promise<ApiResponse<Service>> => {
        return await $fetch(`/v1/services/${serviceId}`, {baseURL})
    }

    const fetchServiceAvailability = async (
        serviceId: number
    ) => {
        return await $fetch<{
            success: boolean
            message: string
            data: AvailabilitySlot[]
        }>(`/v1/services/${serviceId}/availability`, {baseURL})
    }

    // ───────── CATEGORIES (PUBLIC) ─────────
    const fetchCategories = async (): Promise<ApiResponse<Category[]>> => {
        return await $fetch('/v1/categories', {baseURL})
    }

    const fetchCategoryBySlug = async (
        slug: string
    ): Promise<ApiResponse<Category>> => {
        return await $fetch(`/v1/categories/${slug}`, {baseURL})
    }

    // ───────── AUTH ─────────
    const login = async (
        email: string,
        password: string
    ): Promise<LoginResponse> => {
        return await $fetch('/v1/login', {
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
        return await $fetch('/v1/register', {
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

    const fetchProfile = async (token: string): Promise<User> => {
        const response = await $fetch<{
            success: boolean
            message: string
            data: User
        }>('/v1/profile', {
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return response.data
    }

    const logout = async (token: string): Promise<void> => {
        await $fetch('/v1/logout', {
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

    // ───────── BOOKINGS ─────────
    const createBooking = async (
        token: string,
        payload: BookingRequest
    ) => {
        return await $fetch<{
            success: boolean
            message: string
            data: BookingResponse
        }>('/v1/bookings', {
            method: 'POST',
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            body: payload,
        })
    }

    const updateBookingStatus = async (
        token: string,
        bookingId: number,
        status: string
    ) => {
        return await $fetch<{
            success: boolean
            message: string
            data: BookingResponse
        }>(`/v1/bookings/${bookingId}/status`, {
            method: 'PATCH',
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            body: { status },
        })
    }

    const createPaymentIntent = async (
        token: string,
        bookingId: number
    ) => {
        return await $fetch<{
            success: boolean
            message: string
            data: PaymentIntentResponse
        }>(`/v1/bookings/${bookingId}/payment-intent`, {
            method: 'POST',
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    // ───────── INVOICES ─────────
    const fetchInvoices = async (token: string) => {
        return await $fetch<{
            success: boolean
            message: string
            data: Invoice[]
        }>('/v1/invoices', {
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    const fetchInvoice = async (token: string, invoiceId: number) => {
        return await $fetch<{
            success: boolean
            message: string
            data: Invoice
        }>(`/v1/invoices/${invoiceId}`, {
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    const issueInvoice = async (token: string, invoiceId: number) => {
        return await $fetch<{
            success: boolean
            message: string
            data: Invoice
        }>(`/v1/invoices/${invoiceId}/issue`, {
            method: 'PATCH',
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    const payInvoice = async (token: string, invoiceId: number) => {
        return await $fetch<{
            success: boolean
            message: string
            data: Invoice
        }>(`/v1/invoices/${invoiceId}/pay`, {
            method: 'PATCH',
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    const cancelInvoice = async (token: string, invoiceId: number) => {
        return await $fetch<{
            success: boolean
            message: string
            data: Invoice
        }>(`/v1/invoices/${invoiceId}/cancel`, {
            method: 'PATCH',
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    // ───────── PROVIDERS ─────────
    const fetchProviderServices = async (
        token: string,
        providerId: number
    ) => {
        return await $fetch<{
            success: boolean
            message: string
            data: Service[]
        }>(`/v1/providers/${providerId}/services`, {
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    const toggleServiceActive = async (
        token: string,
        serviceId: number,
        isActive: boolean
    ) => {
        return await $fetch<{
            success: boolean
            message: string
            data: Service
        }>(`/v1/services/${serviceId}/toggle-active`, {
            method: 'PATCH',
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            body: { is_active: isActive },
        })
    }

    // ───────── STRIPE CONNECT ─────────
    const createStripeAccount = async (token: string) => {
        return await $fetch<{
            success: boolean
            message: string
            data: StripeConnectResponse
        }>('/v1/stripe/connect', {
            method: 'POST',
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
    }

    return {
        // services (public)
        fetchServices,
        fetchService,
        fetchServiceAvailability,

        // categories (public)
        fetchCategories,
        fetchCategoryBySlug,

        // auth
        login,
        register,
        fetchMe,
        fetchProfile,
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
        fetchDashboardData,

        // bookings
        createBooking,
        updateBookingStatus,
        createPaymentIntent,

        // invoices
        fetchInvoices,
        fetchInvoice,
        issueInvoice,
        payInvoice,
        cancelInvoice,

        // providers
        fetchProviderServices,
        toggleServiceActive,

        // stripe connect
        createStripeAccount,
    }
}