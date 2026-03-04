import { defineStore } from 'pinia'
import type { Invoice, InvoiceState } from '~/types/invoice'
import { useApi } from '~/composables/useApi'

export const useInvoicesStore = defineStore('invoices', {
    state: (): InvoiceState => ({
        invoices: [],
        currentInvoice: null,
        loading: false,
        error: null
    }),

    getters: {
        getById: (state) => {
            return (id: number): Invoice | null =>
                state.invoices.find(invoice => invoice.id === id) ?? null
        },

        draftInvoices: (state) => {
            return state.invoices.filter(i => i.status === 'draft')
        },

        issuedInvoices: (state) => {
            return state.invoices.filter(i => i.status === 'issued')
        },

        paidInvoices: (state) => {
            return state.invoices.filter(i => i.status === 'paid')
        },

        cancelledInvoices: (state) => {
            return state.invoices.filter(i => i.status === 'cancelled')
        }
    },

    actions: {
        async fetchInvoices() {
            const auth = useAuthStore()
            if (!auth.token) return
            if (this.loading) return

            this.loading = true
            this.error = null

            try {
                const response = await useApi().fetchInvoices(auth.token)
                this.invoices = response.data || []
            } catch (error: any) {
                this.error = error.message || 'Failed to fetch invoices'
                console.error('Error fetching invoices:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchInvoice(invoiceId: number) {
            const auth = useAuthStore()
            if (!auth.token) return

            this.loading = true
            this.error = null

            try {
                const response = await useApi().fetchInvoice(auth.token, invoiceId)
                this.currentInvoice = response.data

                const index = this.invoices.findIndex(i => i.id === invoiceId)
                if (index !== -1) {
                    this.invoices[index] = response.data
                }
            } catch (error: any) {
                this.error = error.message || 'Failed to fetch invoice'
                console.error('Error fetching invoice:', error)
            } finally {
                this.loading = false
            }
        },

        async issueInvoice(invoiceId: number) {
            const auth = useAuthStore()
            if (!auth.token) return

            try {
                const response = await useApi().issueInvoice(auth.token, invoiceId)
                const index = this.invoices.findIndex(i => i.id === invoiceId)
                if (index !== -1) {
                    this.invoices[index] = response.data
                }
                if (this.currentInvoice?.id === invoiceId) {
                    this.currentInvoice = response.data
                }
            } catch (error: any) {
                console.error('Error issuing invoice:', error)
                throw error
            }
        },

        async payInvoice(invoiceId: number) {
            const auth = useAuthStore()
            if (!auth.token) return

            try {
                const response = await useApi().payInvoice(auth.token, invoiceId)
                const index = this.invoices.findIndex(i => i.id === invoiceId)
                if (index !== -1) {
                    this.invoices[index] = response.data
                }
                if (this.currentInvoice?.id === invoiceId) {
                    this.currentInvoice = response.data
                }
            } catch (error: any) {
                console.error('Error paying invoice:', error)
                throw error
            }
        },

        async cancelInvoice(invoiceId: number) {
            const auth = useAuthStore()
            if (!auth.token) return

            try {
                const response = await useApi().cancelInvoice(auth.token, invoiceId)
                const index = this.invoices.findIndex(i => i.id === invoiceId)
                if (index !== -1) {
                    this.invoices[index] = response.data
                }
                if (this.currentInvoice?.id === invoiceId) {
                    this.currentInvoice = response.data
                }
            } catch (error: any) {
                console.error('Error cancelling invoice:', error)
                throw error
            }
        },

        clearInvoices() {
            this.invoices = []
            this.currentInvoice = null
            this.error = null
        }
    }
})
