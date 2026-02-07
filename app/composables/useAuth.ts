import { useState } from '#app'
import { computed } from 'vue'

export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call to backend authentication endpoint
      // For demo purposes, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      user.value = {
        id: 1,
        name: 'Demo User',
        email: email,
        avatar: null
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Invalid credentials' }
    }
  }

  // Register with email and password
  const register = async (name: string, email: string, password: string) => {
    try {
      // TODO: Replace with actual API call to backend registration endpoint
      // For demo purposes, we'll simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      user.value = {
        id: 1,
        name: name,
        email: email,
        avatar: null
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Registration failed' }
    }
  }

  // SSO Login - Google
  const loginWithGoogle = async () => {
    try {
      // TODO: Replace with actual Google OAuth redirect or popup flow
      // For demo purposes, we'll simulate a successful SSO login
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      user.value = {
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
  }

  // SSO Login - GitHub
  const loginWithGithub = async () => {
    try {
      // TODO: Replace with actual GitHub OAuth redirect or popup flow
      // For demo purposes, we'll simulate a successful SSO login
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      user.value = {
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
  }

  // Logout
  const logout = async () => {
    user.value = null
    return { success: true }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    loginWithGoogle,
    loginWithGithub,
    logout
  }
}

// Alias for backward compatibility
export const useAuthStore = useAuth
