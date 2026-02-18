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

export interface DashboardState {
    data: DashboardData | null
    loading: boolean
    error: string | null
}

export interface ClientBooking {
    id: number
    service_id: number
    service_title: string
    service_image: string | null
    provider_name: string
    provider_avatar: string | null
    date: string
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    price: number
}

export interface ClientDashboardData {
    bookings: ClientBooking[]
    wallet: {
        balance: number
        currency: string
    }
    top_services: {
        id: number
        title: string
        description: string
        price: string
        rating: number
        image: string | null
        provider_name: string
        category_name: string
    }[]
}

export interface ClientDashboardState {
    data: ClientDashboardData | null
    loading: boolean
    error: string | null
}