import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import type { Category } from '~/types/category'

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        items: [] as Category[],
        loading: false,
        error: null as string | null,
    }),

    getters: {
        bySlug: (state) => {
            return (slug: string) =>
                state.items.find(cat => cat.slug === slug) ?? null
        },
    },

    actions: {
        async fetchCategories() {
            const api = useApi()
            this.loading = true
            this.error = null

            try {
                const response = await api.fetchCategories()
                this.items = response.data
            } catch {
                this.error = 'Failed to load categories'
            } finally {
                this.loading = false
            }
        },
    },
})