import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import type { Service } from '@/types/service'

export const useServicesStore = defineStore('services', {
    state: () => ({
        items: [] as Service[],
        currentService: null as Service | null,
        providerServices: [] as Service[],
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

        async fetchService(serviceId: number) {
            const api = useApi()
            this.loading = true
            this.error = null

            try {
                const response = await api.fetchService(serviceId)
                this.currentService = response.data
                return response.data
            } catch {
                this.error = `Failed to load service ${serviceId}`
            } finally {
                this.loading = false
            }
        },

        async fetchServiceAvailability(serviceId: number) {
            const api = useApi()

            try {
                const response = await api.fetchServiceAvailability(serviceId)
                return response.data
            } catch {
                this.error = `Failed to load availability for service ${serviceId}`
                return []
            }
        },

        async fetchProviderServices(providerId: number) {
            const auth = useAuthStore()
            if (!auth.token) return

            const api = useApi()
            this.loading = true
            this.error = null

            try {
                const response = await api.fetchProviderServices(auth.token, providerId)
                this.providerServices = response.data
            } catch {
                this.error = `Failed to load services for provider ${providerId}`
            } finally {
                this.loading = false
            }
        },

        async toggleServiceActive(serviceId: number) {
            const auth = useAuthStore()
            if (!auth.token) return

            const api = useApi()

            const service = this.providerServices.find(s => s.id === serviceId)
            if (!service) return

            const newStatus = !service.is_active

            try {
                const response = await api.toggleServiceActive(auth.token, serviceId, newStatus)
                const index = this.providerServices.findIndex(s => s.id === serviceId)
                if (index !== -1) {
                    this.providerServices[index] = response.data
                }
            } catch {
                this.error = `Failed to update service ${serviceId}`
            }
        },
    },
})