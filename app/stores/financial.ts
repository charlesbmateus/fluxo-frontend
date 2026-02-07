import { defineStore } from 'pinia'
import type { FinancialData } from '~/types'

export const useFinancialStore = defineStore('financial', {
  state: () => ({
    data: null as FinancialData | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    financialData: (state) => state.data,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    
    revenue: (state) => state.data?.revenue,
    orders: (state) => state.data?.orders,
    services: (state) => state.data?.services,
    chartData: (state) => state.data?.chartData,
  },

  actions: {
    async fetchFinancialData() {
      this.loading = true
      this.error = null
      
      try {
        // TODO: Replace with actual API endpoint from fluxo-backend
        // For now, simulating network delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock financial data - should be replaced with actual API call to fluxo-backend
        this.data = {
          revenue: {
            current: 45231,
            change: 12.5
          },
          orders: {
            current: 1234,
            change: 8.2
          },
          services: {
            current: 42,
            change: 5.1
          },
          chartData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Revenue',
                data: [12000, 19000, 15000, 25000, 32000, 45231],
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4
              }
            ]
          }
        }
      } catch (err) {
        this.error = 'Failed to fetch financial data'
        console.error('Error fetching financial data:', err)
      } finally {
        this.loading = false
      }
    },
    
    clearError() {
      this.error = null
    },
  },
})
