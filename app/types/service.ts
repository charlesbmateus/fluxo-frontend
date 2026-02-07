export interface Provider {
    id: number
    name: string
    role: string
    avatar: string | null
}

export interface Category {
    id: number
    name: string
    slug: string
    icon: string | null
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
}