import { defineStore } from 'pinia'
import type { ClientDashboardData, ClientDashboardState } from '~/types/dashboard'
import { useApi } from '~/composables/useApi'

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
        async fetchClientDashboardData() {
            const auth = useAuthStore()
            if (!auth.token) return
            if (this.loading) return

            this.loading = true
            this.error = null

            try {
                const response = await useApi().fetchClientDashboardData(auth.token)
                this.data = response.data
            } catch (error: any) {
                this.error = error.message || 'Failed to fetch client dashboard data'
                console.error('Error fetching client dashboard data:', error)
            } finally {
                this.loading = false
            }
        },

        clearDashboard() {
            this.data = null
            this.error = null
        }
    }
})
