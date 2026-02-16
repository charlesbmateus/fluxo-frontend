import { useDashboardStore } from '~/stores/dashboard'

export const useDashboard = () => {
    const store = useDashboardStore()

    const fetchData = async () => {
        await store.fetchDashboardData()
    }

    /**
     * Format currency
     */
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    /**
     * Get booking status distribution for pie chart
     */
    const bookingsDistribution = computed(() => {
        if (!store.data) return []

        return [
            { value: store.data.bookings.pending, name: 'Pending' },
            { value: store.data.bookings.confirmed, name: 'Confirmed' },
            { value: store.data.bookings.completed, name: 'Completed' }
        ]
    })

    /**
     * Generate mock monthly data for charts (últimos 7 meses)
     */
    const generateMonthlyData = () => {
        if (!store.data) return { labels: [], bookings: [], earnings: [] }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
        const totalEarnings = store.data.finance.total_earned
        const totalBookings = store.data.bookings.total

        // Distribute earnings and bookings across months with some variation
        const earnings = months.map((_, i) => {
            const base = totalEarnings / 7
            const variation = (Math.random() - 0.5) * base * 0.3
            return Math.round(base + variation)
        })

        const bookings = months.map((_, i) => {
            const base = totalBookings / 7
            const variation = (Math.random() - 0.5) * base * 0.3
            return Math.round(base + variation)
        })

        return { labels: months, earnings, bookings }
    }

    return {
        // State
        data: computed(() => store.data),
        loading: computed(() => store.loading),
        error: computed(() => store.error),

        // Getters
        totalBookings: computed(() => store.totalBookings),
        pendingBookings: computed(() => store.pendingBookings),
        confirmedBookings: computed(() => store.confirmedBookings),
        completedBookings: computed(() => store.completedBookings),
        monthlyBookings: computed(() => store.monthlyBookings),
        totalEarned: computed(() => store.totalEarned),
        monthlyEarnings: computed(() => store.monthlyEarnings),
        pendingEarnings: computed(() => store.pendingEarnings),
        totalServices: computed(() => store.totalServices),
        activeServices: computed(() => store.activeServices),
        averageRating: computed(() => store.averageRating),
        reviewsCount: computed(() => store.reviewsCount),
        bookingsGrowth: computed(() => store.bookingsGrowth),
        earningsGrowth: computed(() => store.earningsGrowth),

        // Actions
        fetchData,
        clearDashboard: store.clearDashboard,

        // Helpers
        formatCurrency,
        bookingsDistribution,
        generateMonthlyData
    }
}