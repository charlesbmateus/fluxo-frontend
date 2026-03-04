import { defineStore } from 'pinia'
import type { BookingRequest, BookingResponse, PaymentIntentResponse } from '~/types/dashboard'
import { useApi } from '~/composables/useApi'

export interface BookingsState {
    currentBooking: BookingResponse | null
    loading: boolean
    error: string | null
}

export const useBookingsStore = defineStore('bookings', {
    state: (): BookingsState => ({
        currentBooking: null,
        loading: false,
        error: null
    }),

    actions: {
        async createBooking(payload: BookingRequest) {
            const auth = useAuthStore()
            if (!auth.token) return

            this.loading = true
            this.error = null

            try {
                const response = await useApi().createBooking(auth.token, payload)
                this.currentBooking = response.data
                return response.data
            } catch (error: any) {
                this.error = error.message || 'Failed to create booking'
                console.error('Error creating booking:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateBookingStatus(bookingId: number, status: string) {
            const auth = useAuthStore()
            if (!auth.token) return

            this.loading = true
            this.error = null

            try {
                const response = await useApi().updateBookingStatus(auth.token, bookingId, status)
                this.currentBooking = response.data
                return response.data
            } catch (error: any) {
                this.error = error.message || 'Failed to update booking status'
                console.error('Error updating booking status:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async createPaymentIntent(bookingId: number): Promise<PaymentIntentResponse | undefined> {
            const auth = useAuthStore()
            if (!auth.token) return

            this.loading = true
            this.error = null

            try {
                const response = await useApi().createPaymentIntent(auth.token, bookingId)
                return response.data
            } catch (error: any) {
                this.error = error.message || 'Failed to create payment intent'
                console.error('Error creating payment intent:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        clearBooking() {
            this.currentBooking = null
            this.error = null
        }
    }
})
