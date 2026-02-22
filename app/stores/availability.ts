import { defineStore } from 'pinia'
import type { AvailabilitySlot, AvailabilityState, TimeSlot } from '~/types/dashboard'
import { useApi } from '~/composables/useApi'

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
    { start: '09:00', end: '12:00' },
    { start: '13:00', end: '17:00' }
]

export const useAvailabilityStore = defineStore('availability', {
    state: (): AvailabilityState => ({
        slots: {},
        loading: false,
        saving: false,
        error: null
    }),

    getters: {
        getSlot: (state) => (dateKey: string): AvailabilitySlot | null => {
            return state.slots[dateKey] || null
        },

        isAvailable: (state) => (dateKey: string): boolean => {
            return state.slots[dateKey]?.available ?? false
        },

        getTimeSlots: (state) => (dateKey: string): TimeSlot[] => {
            return state.slots[dateKey]?.time_slots ?? []
        },

        changedSlots: (state): AvailabilitySlot[] => {
            return Object.values(state.slots)
        }
    },

    actions: {
        toggleDay(dateKey: string) {
            if (this.slots[dateKey]) {
                this.slots[dateKey] = {
                    ...this.slots[dateKey],
                    available: !this.slots[dateKey].available,
                    time_slots: !this.slots[dateKey].available ? [...DEFAULT_TIME_SLOTS] : []
                }
            } else {
                this.slots[dateKey] = {
                    date: dateKey,
                    available: true,
                    time_slots: [...DEFAULT_TIME_SLOTS]
                }
            }
        },

        addTimeSlot(dateKey: string, slot: TimeSlot) {
            if (!this.slots[dateKey]) {
                this.slots[dateKey] = {
                    date: dateKey,
                    available: true,
                    time_slots: []
                }
            }
            this.slots[dateKey].time_slots.push({ ...slot })
        },

        removeTimeSlot(dateKey: string, index: number) {
            if (this.slots[dateKey]) {
                this.slots[dateKey].time_slots.splice(index, 1)
                if (this.slots[dateKey].time_slots.length === 0) {
                    this.slots[dateKey].available = false
                }
            }
        },

        updateTimeSlot(dateKey: string, index: number, slot: TimeSlot) {
            if (this.slots[dateKey] && this.slots[dateKey].time_slots[index]) {
                this.slots[dateKey].time_slots[index] = { ...slot }
            }
        },

        async fetchAvailability(month: string) {
            const auth = useAuthStore()
            if (!auth.token) return

            this.loading = true
            this.error = null

            try {
                const response = await useApi().fetchAvailability(auth.token, month)
                const slotsMap: Record<string, AvailabilitySlot> = {}
                for (const slot of response.data) {
                    slotsMap[slot.date] = slot
                }
                this.slots = slotsMap
            } catch (error: any) {
                this.error = error.message || 'Failed to fetch availability'
                console.error('Error fetching availability:', error)
            } finally {
                this.loading = false
            }
        },

        async saveAvailability() {
            const auth = useAuthStore()
            if (!auth.token) return

            this.saving = true
            this.error = null

            try {
                const slots = Object.values(this.slots)
                await useApi().saveAvailability(auth.token, slots)
            } catch (error: any) {
                this.error = error.message || 'Failed to save availability'
                console.error('Error saving availability:', error)
                throw error
            } finally {
                this.saving = false
            }
        },

        clearAvailability() {
            this.slots = {}
            this.error = null
        }
    }
})
