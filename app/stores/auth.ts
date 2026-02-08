import { defineStore } from 'pinia'
import type { User } from '~/types/auth'
import { useApi } from '~/composables/useApi'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: null as string | null,
        initialized: false,
    }),

    getters: {
        isAuthenticated: state => !!state.token,
    },

    actions: {
        async login(email: string, password: string) {
            const api = useApi()

            try {
                const { user, token } = await api.login(email, password)

                this.user = user
                this.token = token

                localStorage.setItem('auth_token', token)

                return { success: true }
            } catch (error: any) {
                return {
                    success: false,
                    error: error?.data?.message || 'Login failed',
                }
            }
        },

        async register(payload: {
            name: string
            email: string
            password: string
            password_confirmation: string
        }) {
            const api = useApi()

            try {
                const { user, token } = await api.register(payload)

                this.user = user
                this.token = token

                localStorage.setItem('auth_token', token)

                return { success: true }
            } catch (error: any) {
                return {
                    success: false,
                    error: error?.data?.message || 'Register failed',
                }
            }
        },

        async restoreSession() {
            const token = localStorage.getItem('auth_token')

            if (!token) {
                this.initialized = true
                return
            }

            const api = useApi()

            try {
                const response = await api.fetchMe(token)

                this.user = response
                this.token = token
            } catch {
                this.logout()
            } finally {
                this.initialized = true
            }
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('auth_token')
        },
    },
})