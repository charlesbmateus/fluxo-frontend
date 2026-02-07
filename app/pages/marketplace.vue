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
              <option value="">{{ $t('marketplace.filterAll') }}</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Marketing">Marketing</option>
              <option value="Video">Video</option>
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
              <img :src="service.image" :alt="service.name" class="w-full h-full object-cover" />
            </figure>
            <div class="card-body">
              <div class="flex justify-between items-start">
                <h2 class="card-title">{{ service.name }}</h2>
                <div class="badge badge-primary badge-outline">{{ service.category }}</div>
              </div>
              <p class="text-base-content/70">{{ service.description }}</p>
              <div class="flex items-center gap-2 mt-2">
                <div class="avatar">
                  <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                    {{ service.provider.charAt(0) }}
                  </div>
                </div>
                <span class="text-sm text-base-content/70">{{ service.provider }}</span>
              </div>
              <div class="card-actions justify-between items-center mt-4">
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-secondary">
                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                  </svg>
                  <span class="font-semibold">{{ service.rating }}</span>
                </div>
                <div class="text-xl font-bold text-primary">${{ service.price }}</div>
              </div>
              <button class="btn btn-primary btn-sm mt-2">
                {{ $t('marketplace.viewDetails') }}
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredServices.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto text-base-content/30">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <p class="text-base-content/60 mt-4">No services found</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Service } from '~/types'

const { fetchServices } = useApi()
const router = useRouter()

const services = ref<Service[]>([])
const searchQuery = ref('')
const selectedCategory = ref('')
const loading = ref(true)

const filteredServices = computed(() => {
  return services.value.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || service.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const goToService = (id: number) => {
  router.push(`/service/${id}`)
}

onMounted(async () => {
  loading.value = true
  try {
    const data = await fetchServices()
    services.value = data.data
  } finally {
    loading.value = false
  }
})
</script>
