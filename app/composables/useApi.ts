import type { ApiResponse, PaginatedResponse } from '~/types/api'
import type { Service } from '~/types/service'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:8000/api'

  const fetchServices = async (
      page = 1
  ): Promise<ApiResponse<PaginatedResponse<Service>>> => {
    return await $fetch(`/services?page=${page}`, { baseURL })
  }

  return {
    fetchServices,
  }
}