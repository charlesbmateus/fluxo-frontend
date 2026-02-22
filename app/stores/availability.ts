import { defineStore } from 'pinia'
import type { AvailabilitySlot, AvailabilityState } from '~/types/availability'
import { useApi } from '~/composables/useApi'

export const useAvailabilityStore = defineStore('availability', {
    state: (): AvailabilityState => ({
        slots: [],
        loading: false,
        saving: false,
        error: null,
    }),

    getters: {
        slotsByDate: (state) => {
            const map: Record<string, AvailabilitySlot[]> = {}
            for (const slot of state.slots) {
                if (!map[slot.date]) {
                    map[slot.date] = []
                }
                map[slot.date].push(slot)
            }
            return map
        },

        datesWithSlots: (state) => {
            return [...new Set(state.slots.map(s => s.date))]
        },
    },

    actions: {
        async fetchSlots(month: string) {
            const auth = useAuthStore()
            if (!auth.token) return

            this.loading = true
            this.error = null

            try {
                const response = await useApi().fetchAvailability(auth.token, month)
                this.slots = response.data
            } catch (error: any) {
                this.error = error?.data?.message || error.message || 'Failed to fetch availability'
                console.error('Error fetching availability:', error)
            } finally {
                this.loading = false
            }
        },

        async addSlot(payload: { date: string; start_time: string; end_time: string }) {
            const auth = useAuthStore()
            if (!auth.token) return

            this.saving = true
            this.error = null

            try {
                const response = await useApi().createAvailability(auth.token, payload)
                this.slots.push(response.data)
            } catch (error: any) {
                this.error = error?.data?.message || error.message || 'Failed to create availability'
                console.error('Error creating availability:', error)
                throw error
            } finally {
                this.saving = false
            }
        },

        async updateSlot(id: number, payload: { start_time: string; end_time: string }) {
            const auth = useAuthStore()
            if (!auth.token) return

            this.saving = true
            this.error = null

            try {
                const response = await useApi().updateAvailability(auth.token, id, payload)
                const index = this.slots.findIndex(s => s.id === id)
                if (index !== -1) {
                    this.slots[index] = response.data
                }
            } catch (error: any) {
                this.error = error?.data?.message || error.message || 'Failed to update availability'
                console.error('Error updating availability:', error)
                throw error
            } finally {
                this.saving = false
            }
        },

        async removeSlot(id: number) {
            const auth = useAuthStore()
            if (!auth.token) return

            this.saving = true
            this.error = null

            try {
                await useApi().deleteAvailability(auth.token, id)
                this.slots = this.slots.filter(s => s.id !== id)
            } catch (error: any) {
                this.error = error?.data?.message || error.message || 'Failed to delete availability'
                console.error('Error deleting availability:', error)
                throw error
            } finally {
                this.saving = false
            }
        },

        clearAvailability() {
            this.slots = []
            this.error = null
        },
    },
})
