import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import type { Service } from '@/types/service'

export const useServicesStore = defineStore('services', {
    state: () => ({
        items: [] as Service[],
        loading: false,
        error: null as string | null,
    }),

    getters: {
        getById: (state) => {
            return (id: number): Service | null =>
                state.items.find(service => service.id === id) ?? null
        },
    },

    actions: {
        async fetchServices(page = 1) {
            const api = useApi()
            this.loading = true
            this.error = null

            try {
                const response = await api.fetchServices(page)
                this.items = response.data.data
            } catch {
                this.error = 'Failed to load services'
            } finally {
                this.loading = false
            }
        },
    },
})