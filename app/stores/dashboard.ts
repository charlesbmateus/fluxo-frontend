import { defineStore } from 'pinia'
import type { DashboardData, DashboardState } from '~/types/dashboard'
import { useApi } from '~/composables/useApi'

export const useDashboardStore = defineStore('dashboard', {
    state: (): DashboardState => ({
        data: null,
        loading: false,
        error: null
    }),

    getters: {
        // Bookings
        totalBookings: (state) => state.data?.bookings.total || 0,
        pendingBookings: (state) => state.data?.bookings.pending || 0,
        confirmedBookings: (state) => state.data?.bookings.confirmed || 0,
        completedBookings: (state) => state.data?.bookings.completed || 0,
        cancelledBookings: (state) => state.data?.bookings.cancelled || 0,
        monthlyBookings: (state) => state.data?.bookings.this_month || 0,
        lastMonthBookings: (state) => state.data?.bookings.last_month || 0,

        // Finance
        totalEarned: (state) => state.data?.finance.total_earned || 0,
        monthlyEarnings: (state) => state.data?.finance.this_month || 0,
        lastMonthEarnings: (state) => state.data?.finance.last_month || 0,
        yearlyTotal: (state) => state.data?.finance.yearly_total || 0,
        pendingEarnings: (state) => state.data?.finance.pending_payout || 0,

        // Services
        totalServices: (state) => state.data?.services.total || 0,
        activeServices: (state) => state.data?.services.active || 0,
        inactiveServices: (state) => state.data?.services.inactive || 0,

        // Reviews
        averageRating: (state) => state.data?.reviews.average_rating || 0,
        reviewsCount: (state) => state.data?.reviews.reviews_count || 0,

        // Charts
        monthlyRevenueChart: (state) => state.data?.charts.monthly_revenue || [],

        // REAL Growth calculations
        bookingsGrowth: (state) => {
            if (!state.data) return 0

            const thisMonth = state.data.bookings.this_month
            const lastMonth = state.data.bookings.last_month

            if (!lastMonth || lastMonth === 0) {
                if (thisMonth > 0) return 100
                return 0
            }

            const growth = ((thisMonth - lastMonth) / lastMonth) * 100

            return Number(growth.toFixed(1))
        },

        earningsGrowth: (state) => {
            if (!state.data) return 0

            const thisMonth = state.data.finance.this_month
            const lastMonth = state.data.finance.last_month

            if (!lastMonth || lastMonth === 0) {
                if (thisMonth > 0) return 100
                return 0
            }

            const growth = ((thisMonth - lastMonth) / lastMonth) * 100

            return Number(growth.toFixed(1))
        }
    },

    actions: {
        async fetchDashboardData() {
            const auth = useAuthStore()
            if (!auth.token) return
            if (this.loading) return

            this.loading = true
            this.error = null

            try {
                const response = await useApi().fetchDashboardData(auth.token)
                this.data = response.data
            } catch (error: any) {
                this.error = error.message || 'Failed to fetch dashboard data'
                console.error('Error fetching dashboard data:', error)
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