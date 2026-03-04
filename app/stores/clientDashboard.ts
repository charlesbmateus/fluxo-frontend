import { defineStore } from 'pinia'
import type { ClientDashboardData, ClientDashboardState } from '~/types/dashboard'

export const useClientDashboardStore = defineStore('clientDashboard', {
    state: (): ClientDashboardState => ({
        data: null,
        loading: false,
        error: null
    }),

    getters: {
        hasBookings: (state) => (state.data?.bookings?.length ?? 0) > 0,
        bookings: (state) => state.data?.bookings ?? [],
        walletBalance: (state) => state.data?.wallet?.balance ?? 0,
        walletCurrency: (state) => state.data?.wallet?.currency ?? 'USD',
        topServices: (state) => state.data?.top_services ?? [],

        upcomingBookings: (state) => {
            if (!state.data?.bookings) return []
            const now = new Date()
            return state.data.bookings
                .filter(b => new Date(b.date) >= now && b.status !== 'cancelled')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        },

        bookingsByDate: (state) => {
            if (!state.data?.bookings) return {}
            const map: Record<string, typeof state.data.bookings> = {}
            for (const booking of state.data.bookings) {
                const dateKey = booking.date.split('T')[0]
                if (!map[dateKey]) map[dateKey] = []
                map[dateKey].push(booking)
            }
            return map
        }
    },

    actions: {
        setData(data: ClientDashboardData) {
            this.data = data
        },

        clearDashboard() {
            this.data = null
            this.error = null
        }
    }
})
