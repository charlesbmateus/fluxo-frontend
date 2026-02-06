<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold">{{ $t('dashboard.welcome') }}</h1>
          <p class="text-base-content/60 mt-1">{{ $t('dashboard.title') }}</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <template v-if="loading">
          <StatCardSkeleton v-for="i in 4" :key="i" />
        </template>
        <template v-else>
          <div class="stat bg-base-100 rounded-lg shadow">
            <div class="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title">{{ $t('dashboard.revenue') }}</div>
            <div class="stat-value text-primary">${{ financialData?.revenue.current.toLocaleString() }}</div>
            <div class="stat-desc" :class="financialData?.revenue.change > 0 ? 'text-success' : 'text-error'">
              {{ financialData?.revenue.change > 0 ? '↗︎' : '↘︎' }} {{ Math.abs(financialData?.revenue.change || 0) }}% {{ $t('dashboard.growth') }}
            </div>
          </div>

          <div class="stat bg-base-100 rounded-lg shadow border-t-4 border-secondary">
            <div class="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title">{{ $t('dashboard.orders') }}</div>
            <div class="stat-value text-secondary">{{ financialData?.orders.current }}</div>
            <div class="stat-desc" :class="financialData?.orders.change > 0 ? 'text-success' : 'text-error'">
              {{ financialData?.orders.change > 0 ? '↗︎' : '↘︎' }} {{ Math.abs(financialData?.orders.change || 0) }}%
            </div>
          </div>

          <div class="stat bg-base-100 rounded-lg shadow">
            <div class="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div class="stat-title">{{ $t('dashboard.services') }}</div>
            <div class="stat-value">{{ financialData?.services.current }}</div>
            <div class="stat-desc" :class="financialData?.services.change > 0 ? 'text-success' : 'text-error'">
              {{ financialData?.services.change > 0 ? '↗︎' : '↘︎' }} {{ Math.abs(financialData?.services.change || 0) }}%
            </div>
          </div>

          <div class="stat bg-gradient-to-br from-primary to-secondary rounded-lg shadow text-white">
            <div class="stat-title text-white/80">Total Value</div>
            <div class="stat-value">$58K</div>
            <div class="stat-desc text-white/80">↗︎ 15.3% this month</div>
          </div>
        </template>
      </div>

      <!-- Chart Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <template v-if="loading">
          <ChartSkeleton />
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <div class="h-6 bg-base-300 rounded w-1/3 mb-4 animate-pulse"></div>
              <div class="space-y-3">
                <ServiceCardSkeleton v-for="i in 3" :key="i" />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">Revenue Overview</h2>
              <ClientOnly>
                <LineChart v-if="financialData" :data="financialData.chartData" />
              </ClientOnly>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">Recent Services</h2>
              <div class="space-y-3">
                <NuxtLink v-for="service in recentServices" :key="service.id" :to="`/service/${service.id}`" class="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="w-10 h-10 rounded">
                        <img :src="service.image" :alt="service.name" />
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold">{{ service.name }}</p>
                      <p class="text-sm text-base-content/60">{{ service.provider }}</p>
                    </div>
                  </div>
                  <div class="badge badge-secondary">${{ service.price }}</div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Quick Actions -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Quick Actions</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <NuxtLink to="/marketplace" class="btn btn-outline btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
              Browse Marketplace
            </NuxtLink>
            <NuxtLink to="/messages" class="btn btn-outline btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              View Messages
            </NuxtLink>
            <button class="btn btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add New Service
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { fetchFinancialData, fetchServices } = useApi()

const financialData = ref(null)
const recentServices = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    financialData.value = await fetchFinancialData()
    const servicesData = await fetchServices()
    recentServices.value = servicesData.data.slice(0, 3)
  } finally {
    loading.value = false
  }
})
</script>
