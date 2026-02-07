export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface PaginatedResponse<T> {
    data: T[]
    current_page: number
    last_page: number
    total: number
    per_page: number
}