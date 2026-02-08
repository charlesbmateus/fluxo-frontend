import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

export const useAuth = () => {
  const store = useAuthStore()
  const { user, isAuthenticated } = storeToRefs(store)

  return {
    user,
    isAuthenticated,
    login: store.login,
    register: store.register,

    // placeholders para el futuro
    loginWithGoogle: async () => ({ success: false }),
    loginWithGithub: async () => ({ success: false }),
  }
}