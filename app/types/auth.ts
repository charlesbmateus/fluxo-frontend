export interface User {
    id: number
    name: string
    email: string
    email_verified_at?: Date | null
    created_at: Date
    role: 'client' | 'provider' | 'admin'
    avatar?: string | null
}

export interface LoginResponse {
    user: User
    token: string
}