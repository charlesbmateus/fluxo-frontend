import type { ApiResponse, PaginatedResponse } from '~/types/api'
import type { Service } from '~/types/service'

const config = useRuntimeConfig()

const baseURL: string =
    (config.public.apiBase as string) || 'http://localhost:8000/api'

export const useApi = () => {
  const config = useRuntimeConfig()

  const fetchServices = async (
      page = 1
  ): Promise<ApiResponse<PaginatedResponse<Service>>> => {
    return await $fetch(`/services?page=${page}`, { baseURL })
  }

  return {
    fetchServices,
  }
}