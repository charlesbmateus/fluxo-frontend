export interface DashboardData {
    bookings: {
        total: number
        pending: number
        confirmed: number
        completed: number
        cancelled: number
        this_month: number
        last_month: number
    }
    finance: {
        total_earned: number
        this_month: number
        last_month: number
        yearly_total: number
        pending_payout: number
    }
    services: {
        total: number
        active: number
        inactive: number
    }
    reviews: {
        average_rating: number
        reviews_count: number
    }
    charts: {
        monthly_revenue: {
            month: string
            total: number
        }[]
    }
}