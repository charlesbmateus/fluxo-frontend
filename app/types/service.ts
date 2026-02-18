export interface Provider {
    id: number
    name: string
    role: string
    avatar: string | null
}

export interface ProviderProfile {
    id: number
    name: string
    role: string
    avatar: string | null
    bio: string | null
    city: string | null
    country: string | null
    joined_at: string | null
    rating: number
    reviews_count: number
    completed_services: number
    years_experience: number
    response_time: string
    services: Service[]
    reviews: ServiceReview[]
    portfolio_images: ServiceImage[]
    availability: ProviderAvailability[]
}

export interface ProviderAvailability {
    date: string
    available: boolean
}

export interface Category {
    id: number
    name: string
    slug: string
    icon: string | null
}

export interface ServiceImage {
    id: number
    url: string
    alt: string | null
}

export interface ServiceReview {
    id: number
    author: string
    avatar: string | null
    rating: number
    comment: string
    date: string
}

export interface Service {
    id: number
    title: string
    description: string
    price: string
    pricing_model: 'fixed' | 'hourly'
    city: string
    country: string
    is_active: boolean
    thumbnail: string | null
    status: string
    category: Category
    provider: Provider
    images?: ServiceImage[]
    rating?: number
    reviews_count?: number
    reviews?: ServiceReview[]
    years_experience?: number
    response_time?: string
}