<template>
  <NuxtLayout name="default">
    <div class="space-y-6" v-if="service">
      <!-- Back Button -->
      <button @click="$router.back()" class="btn btn-ghost btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>

      <!-- Service Header -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex flex-col lg:flex-row gap-6">
            <figure class="lg:w-1/2 rounded-lg overflow-hidden">
              <img :src="service.image" :alt="service.name" class="w-full h-80 object-cover" />
            </figure>
            <div class="lg:w-1/2 space-y-4">
              <div>
                <div class="badge badge-primary badge-lg mb-2">{{ service.category }}</div>
                <h1 class="text-4xl font-bold">{{ service.name }}</h1>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-secondary">
                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-2xl font-bold">{{ service.rating }}</span>
                  <span class="text-base-content/60">(234 reviews)</span>
                </div>
              </div>

              <div class="divider"></div>

              <div>
                <h3 class="text-xl font-semibold mb-2">{{ $t('service.provider') }}</h3>
                <div class="flex items-center gap-3">
                  <div class="avatar">
                    <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg">
                      {{ service.provider.charAt(0) }}
                    </div>
                  </div>
                  <div>
                    <p class="font-semibold">{{ service.provider }}</p>
                    <p class="text-sm text-base-content/60">Professional Service Provider</p>
                  </div>
                </div>
              </div>

              <div class="divider"></div>

              <div>
                <div class="flex justify-between items-center mb-4">
                  <span class="text-base-content/60">{{ $t('service.price') }}</span>
                  <span class="text-3xl font-bold text-primary">${{ service.price }}</span>
                </div>
                <button class="btn btn-primary btn-block btn-lg">
                  {{ $t('service.bookNow') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Details -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title text-2xl">{{ $t('service.description') }}</h2>
              <p class="text-base-content/80 leading-relaxed">
                {{ service.description }}
              </p>
              <div class="mt-4">
                <h3 class="font-semibold mb-2">What's Included:</h3>
                <ul class="list-disc list-inside space-y-2 text-base-content/70">
                  <li>Professional service delivery</li>
                  <li>High-quality results</li>
                  <li>Customer support</li>
                  <li>Revision included</li>
                  <li>Fast turnaround time</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="card bg-base-100 shadow-xl mt-6">
            <div class="card-body">
              <h2 class="card-title text-2xl">Customer Reviews</h2>
              <div class="space-y-4">
                <div v-for="i in 3" :key="i" class="border-b border-base-300 pb-4">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="flex items-center">
                      <svg v-for="j in 5" :key="j" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-secondary">
                        <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span class="font-semibold">Customer {{ i }}</span>
                    <span class="text-sm text-base-content/60">2 days ago</span>
                  </div>
                  <p class="text-base-content/70">Excellent service! Highly recommended. Very professional and delivered on time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="card bg-base-100 shadow-xl sticky top-4">
            <div class="card-body">
              <h3 class="card-title">Similar Services</h3>
              <div class="space-y-3">
                <div v-for="i in 3" :key="i" class="flex gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer">
                  <div class="w-16 h-16 rounded bg-primary/20"></div>
                  <div class="flex-1">
                    <p class="font-semibold text-sm">Similar Service {{ i }}</p>
                    <p class="text-xs text-base-content/60">Starting at $250</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="flex justify-center items-center min-h-screen">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchServices } = useApi()

const service = ref(null)

onMounted(async () => {
  const id = parseInt(route.params.id as string)
  const data = await fetchServices()
  service.value = data.data.find(s => s.id === id)
})
</script>
