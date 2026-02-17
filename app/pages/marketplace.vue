<script setup lang="ts">
import { useServicesStore } from '~/stores/services'
import { useCategoriesStore } from '~/stores/categories'
import { storeToRefs } from 'pinia'
import type { Service } from '~/types/service'

const router = useRouter()

const serviceStore = useServicesStore()
const categoriesStore = useCategoriesStore()
const { items: services, loading } = storeToRefs(serviceStore)
const { items: categories } = storeToRefs(categoriesStore)

const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)

const filteredServices = computed<Service[]>(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const selectedSlug = selectedCategory.value

  return services.value.filter(service => {
    const matchesSearch =
        !query ||
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)

    const matchesCategory =
        !selectedSlug || service.category.slug === selectedSlug

    return matchesSearch && matchesCategory
  })
})

const goToService = (id: number) => {
  router.push(`/service/${id}`)
}

onMounted(() => {
  serviceStore.fetchServices()
  categoriesStore.fetchCategories()
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold">{{ $t('marketplace.title') }}</h1>
        <p class="text-base-content/60 mt-1">Discover amazing services from talented professionals</p>
      </div>

      <!-- Search and Filters -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <input 
                type="text" 
                :placeholder="$t('marketplace.searchPlaceholder')" 
                class="input input-bordered w-full"
                v-model="searchQuery"
              />
            </div>
            <select class="select select-bordered" v-model="selectedCategory">
              <option :value="null">
                {{ $t('marketplace.filterAll') }}
              </option>

              <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.slug"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-if="loading">
          <SkeletonsServiceCardSkeleton v-for="i in 6" :key="i" />
        </template>
        <template v-else>
          <div 
            v-for="service in filteredServices" 
            :key="service.id" 
            class="card bg-base-100 shadow-xl card-hover cursor-pointer"
            @click="goToService(service.id)"
          >
            <figure class="h-48">
              <img :src="service.thumbnail || 'undefined'" :alt="service.title" class="w-full h-full object-cover" />
            </figure>
            <div class="card-body">
              <div class="flex justify-between items-start">
                <h2 class="card-title">{{ service.title }}</h2>
                <div class="badge badge-primary badge-outline">{{ service.category.name }}</div>
              </div>
              <p class="text-base-content/70">{{ service.description }}</p>
              <div class="flex items-center gap-2 mt-2">
                <div class="avatar">
                  <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                    {{ service.provider.name.charAt(0) }}
                  </div>
                </div>
                <span class="text-sm text-base-content/70">{{ service.provider.name }}</span>
              </div>
<!--              <div class="card-actions justify-between items-center mt-4">-->
<!--                <div class="flex items-center gap-1">-->
<!--                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-secondary">-->
<!--                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />-->
<!--                  </svg>-->
<!--                  <span class="font-semibold">{{ service.provider.rating }}</span>-->
<!--                </div>-->
<!--                <div class="text-xl font-bold text-primary">${{ service.price }}</div>-->
<!--              </div>-->
              <button class="btn btn-primary btn-sm mt-2">
                {{ $t('marketplace.viewDetails') }}
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredServices.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <p class="text-base-content/60 mt-4">No services found</p>
      </div>
    </div>
  </NuxtLayout>
</template>
