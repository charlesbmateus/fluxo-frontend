import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
  avatar: string | null
  provider?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        // TODO: Replace with actual API endpoint from fluxo-backend
        // For now, simulating network delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock login - should be replaced with actual API call to fluxo-backend
        this.user = {
          id: 1,
          name: 'Demo User',
          email: email,
          avatar: null
        }
        
        return { success: true }
      } catch (err) {
        this.error = 'Invalid credentials'
        return { success: false, error: 'Invalid credentials' }
      } finally {
        this.loading = false
      }
    },

    async register(name: string, email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        // TODO: Replace with actual API endpoint from fluxo-backend
        // For now, simulating network delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock registration - should be replaced with actual API call to fluxo-backend
        this.user = {
          id: 1,
          name: name,
          email: email,
          avatar: null
        }
        
        return { success: true }
      } catch (err) {
        this.error = 'Registration failed'
        return { success: false, error: 'Registration failed' }
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle() {
      this.loading = true
      this.error = null
      
      try {
        // TODO: Replace with actual Google OAuth flow
        // For now, simulating network delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock SSO login - should be replaced with actual OAuth flow
        this.user = {
          id: 1,
          name: 'Google User',
          email: 'user@gmail.com',
          avatar: null,
          provider: 'google'
        }
        
        return { success: true }
      } catch (err) {
        this.error = 'Google login failed'
        return { success: false, error: 'Google login failed' }
      } finally {
        this.loading = false
      }
    },

    async loginWithGithub() {
      this.loading = true
      this.error = null
      
      try {
        // TODO: Replace with actual GitHub OAuth flow
        // For now, simulating network delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock SSO login - should be replaced with actual OAuth flow
        this.user = {
          id: 1,
          name: 'GitHub User',
          email: 'user@github.com',
          avatar: null,
          provider: 'github'
        }
        
        return { success: true }
      } catch (err) {
        this.error = 'GitHub login failed'
        return { success: false, error: 'GitHub login failed' }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.error = null
      return { success: true }
    },
    
    clearError() {
      this.error = null
    },
  },
})
