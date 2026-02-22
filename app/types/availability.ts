export interface AvailabilitySlot {
    id: number
    date: string
    start_time: string
    end_time: string
    is_booked: boolean
}

export interface AvailabilityState {
    slots: AvailabilitySlot[]
    loading: boolean
    saving: boolean
    error: string | null
}
