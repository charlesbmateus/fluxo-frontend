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
    user: null as User | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    // Login with email and password
    async login(email: string, password: string) {
      try {
        // TODO: Replace with actual API call to backend authentication endpoint
        // For demo purposes, we'll simulate a successful login
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.user = {
          id: 1,
          name: 'Demo User',
          email: email,
          avatar: null
        }
        
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Invalid credentials' }
      }
    },

    // Register with email and password
    async register(name: string, email: string, password: string) {
      try {
        // TODO: Replace with actual API call to backend registration endpoint
        // For demo purposes, we'll simulate a successful registration
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.user = {
          id: 1,
          name: name,
          email: email,
          avatar: null
        }
        
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Registration failed' }
      }
    },

    // SSO Login - Google
    async loginWithGoogle() {
      try {
        // TODO: Replace with actual Google OAuth redirect or popup flow
        // For demo purposes, we'll simulate a successful SSO login
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        this.user = {
          id: 1,
          name: 'Google User',
          email: 'user@gmail.com',
          avatar: null,
          provider: 'google'
        }
        
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Google login failed' }
      }
    },

    // SSO Login - GitHub
    async loginWithGithub() {
      try {
        // TODO: Replace with actual GitHub OAuth redirect or popup flow
        // For demo purposes, we'll simulate a successful SSO login
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        this.user = {
          id: 1,
          name: 'GitHub User',
          email: 'user@github.com',
          avatar: null,
          provider: 'github'
        }
        
        return { success: true }
      } catch (error) {
        return { success: false, error: 'GitHub login failed' }
      }
    },

    // Logout
    async logout() {
      this.user = null
      return { success: true }
    }
  }
})
