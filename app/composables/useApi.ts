// composables/useApi.ts
import type { ApiResponse, PaginatedResponse } from '~/types/api'
import type { Service } from '~/types/service'
import type { Category } from '~/types/category'

export const useApi = () => {
  const config = useRuntimeConfig()

  const baseURL: string =
      (config.public.apiBase as string) || 'http://localhost:8000/api'

  const fetchServices = async (
      page = 1
  ): Promise<ApiResponse<PaginatedResponse<Service>>> => {
    return await $fetch(`/services?page=${page}`, { baseURL })
  }

  const fetchCategories = async (): Promise<ApiResponse<Category[]>> => {
    return await $fetch('/categories', { baseURL })
  }

  return {
    fetchServices,
    fetchCategories,
  }
}