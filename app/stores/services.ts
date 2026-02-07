import { defineStore } from 'pinia'
import type { Service } from '~/types'

export const useServicesStore = defineStore('services', {
  state: () => ({
    services: [] as Service[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allServices: (state) => state.services,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    
    serviceById: (state) => (id: number) => {
      return state.services.find(service => service.id === id)
    },
    
    servicesByCategory: (state) => (category: string) => {
      return state.services.filter(service => service.category === category)
    },
  },

  actions: {
    async fetchServices() {
      this.loading = true
      this.error = null
      
      try {
        // TODO: Replace with actual API endpoint from fluxo-backend
        // For now, simulating network delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - should be replaced with actual API call to fluxo-backend
        const mockData = [
          {
            id: 1,
            name: 'Web Development',
            description: 'Professional web development services',
            provider: 'John Doe',
            price: 500,
            rating: 4.8,
            category: 'Development',
            image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          },
          {
            id: 2,
            name: 'Graphic Design',
            description: 'Creative graphic design solutions',
            provider: 'Jane Smith',
            price: 300,
            rating: 4.9,
            category: 'Design',
            image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400'
          },
          {
            id: 3,
            name: 'Content Writing',
            description: 'High-quality content writing',
            provider: 'Mike Johnson',
            price: 200,
            rating: 4.7,
            category: 'Writing',
            image: 'https://plus.unsplash.com/premium_photo-1664286775376-bd07fece39ee?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          },
          {
            id: 4,
            name: 'Digital Marketing',
            description: 'Comprehensive digital marketing strategies',
            provider: 'Sarah Williams',
            price: 700,
            rating: 4.9,
            category: 'Marketing',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
          },
          {
            id: 5,
            name: 'Video Editing',
            description: 'Professional video editing services',
            provider: 'Tom Brown',
            price: 400,
            rating: 4.6,
            category: 'Video',
            image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400'
          },
          {
            id: 6,
            name: 'SEO Optimization',
            description: 'Boost your search engine rankings',
            provider: 'Emma Davis',
            price: 600,
            rating: 4.8,
            category: 'Marketing',
            image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400'
          }
        ]
        
        this.services = mockData
      } catch (err) {
        this.error = 'Failed to fetch services'
        console.error('Error fetching services:', err)
      } finally {
        this.loading = false
      }
    },
    
    clearError() {
      this.error = null
    },
  },
})
