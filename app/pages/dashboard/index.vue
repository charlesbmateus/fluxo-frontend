<script setup lang="ts">
import type { FinancialData, Service } from '~/types'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import { useDashboard } from '~/composables/useDashboard'

const { /*fetchFinancialData, */ fetchServices } = useApi()
const dashboard = useDashboard()
const { user } = useAuth()
const colorMode = useColorMode()

const isClient = computed(() => user.value?.role === 'client')

const financialData = computed<FinancialData | null>(() => {
  const data = dashboard.data.value
  if (!data) return null

  return {
    revenue: {
      current: data.finance.this_month,
      change: dashboard.earningsGrowth.value
    },
    orders: {
      current: data.bookings.this_month,
      change: dashboard.bookingsGrowth.value
    },
    services: {
      current: data.services.active,
      change: 0
    },
    totalValue: {
      current: data.finance.total_earned,
      change: dashboard.earningsGrowth.value
    },
    chartData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      revenue: data.finance.monthly_chart.map(m => m.total),
      orders: data.bookings.monthly_chart.map(m => m.total)
    }
  }
})

// const mockFinancialData = {
//   revenue: { current: 45230, change: 12.5 },
//   orders: { current: 156, change: 8.3 },
//   services: { current: 24, change: 5.2 },
//   totalValue: { current: 58000, change: 15.3 },
//   chartData: {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//     revenue: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
//     orders: [45, 62, 58, 78, 65, 85, 82]
//   }
// }

const recentServices = ref<Service[]>([])
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    await dashboard.fetchData()
    const servicesData = await fetchServices()
    recentServices.value = servicesData.data.data.slice(0, 3)
  } finally {
    loading.value = false
  }
})

// Detect theme changes
const isDark = computed(() => colorMode.value === 'dark')

// Revenue Line Chart Options
const revenueChartOptions = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: isDark.value ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDark.value ? '#374151' : '#e5e7eb',
    textStyle: {
      color: isDark.value ? '#f3f4f6' : '#1f2937'
    },
    formatter: (params: any) => {
      const data = params[0]
      return `${data.name}<br/>${data.seriesName}: <strong>$${data.value.toLocaleString()}</strong>`
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: financialData.value?.chartData.labels || [],
    axisLine: {
      lineStyle: {
        color: isDark.value ? '#374151' : '#e5e7eb'
      }
    },
    axisLabel: {
      color: isDark.value ? '#9ca3af' : '#6b7280'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: isDark.value ? '#374151' : '#f3f4f6'
      }
    },
    axisLabel: {
      color: isDark.value ? '#9ca3af' : '#6b7280',
      formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`
    }
  },
  series: [
    {
      name: 'Revenue',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: financialData.value?.chartData.revenue || [],
      lineStyle: {
        width: 3,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#8b5cf6' },
            { offset: 1, color: '#fbbf24' }
          ]
        }
      },
      itemStyle: {
        color: '#8b5cf6',
        borderWidth: 2,
        borderColor: '#fff'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0.05)' }
          ]
        }
      }
    }
  ]
}))

// Orders Bar Chart Options
const ordersChartOptions = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: isDark.value ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDark.value ? '#374151' : '#e5e7eb',
    textStyle: {
      color: isDark.value ? '#f3f4f6' : '#1f2937'
    },
    formatter: (params: any) => {
      const data = params[0]
      return `${data.name}<br/>${data.seriesName}: <strong>${data.value}</strong> orders`
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: financialData.value?.chartData.labels || [],
    axisLine: {
      lineStyle: {
        color: isDark.value ? '#374151' : '#e5e7eb'
      }
    },
    axisLabel: {
      color: isDark.value ? '#9ca3af' : '#6b7280'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: isDark.value ? '#374151' : '#f3f4f6'
      }
    },
    axisLabel: {
      color: isDark.value ? '#9ca3af' : '#6b7280'
    }
  },
  series: [
    {
      name: 'Orders',
      type: 'bar',
      data: financialData.value?.chartData.orders || [],
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#fbbf24' },
            { offset: 1, color: '#f59e0b' }
          ]
        }
      },
      barWidth: '50%'
    }
  ]
}))

// Services Distribution Pie Chart Options
const servicesChartOptions = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: isDark.value ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDark.value ? '#374151' : '#e5e7eb',
    textStyle: {
      color: isDark.value ? '#f3f4f6' : '#1f2937'
    },
    formatter: (params: any) => {
      return `${params.name}<br/><strong>${params.value}</strong> (${params.percent}%)`
    }
  },
  legend: {
    bottom: '5%',
    left: 'center',
    textStyle: {
      color: isDark.value ? '#9ca3af' : '#6b7280'
    }
  },
  series: [
    {
      name: 'Services',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: isDark.value ? '#1f2937' : '#fff',
        borderWidth: 2
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          color: isDark.value ? '#f3f4f6' : '#1f2937'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 65, name: 'Active', itemStyle: { color: '#8b5cf6' } },
        { value: 20, name: 'Pending', itemStyle: { color: '#fbbf24' } },
        { value: 10, name: 'Completed', itemStyle: { color: '#22c55e' } },
        { value: 5, name: 'Cancelled', itemStyle: { color: '#ef4444' } }
      ]
    }
  ]
}))

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})
</script>

<template>
  <NuxtLayout name="default">
    <!-- Client Dashboard -->
    <ClientDashboard v-if="isClient" />

    <!-- Provider Dashboard -->
    <div v-else class="space-y-6">
      <!-- Welcome Section with gradient -->
        <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div class="relative z-10">
          <h1 class="text-3xl font-bold mb-2">{{ greeting }}, {{ user?.name || 'there' }}! 👋</h1>
          <p>Here's what's happening with your marketplace today</p>
        </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <template v-if="loading">
          <SkeletonsStatCardSkeleton v-for="i in 4" :key="i" />
        </template>
        <template v-else>
          <!-- Revenue Card -->
          <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="badge badge-success gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {{ financialData?.revenue.change }}%
                </div>
              </div>
              <div class="stat-title text-base-content/60 text-sm">{{ $t('dashboard.revenue') }}</div>
              <div class="stat-value text-3xl font-bold text-purple-600">
                ${{ financialData?.revenue.current.toLocaleString() }}
              </div>
              <div class="text-xs text-base-content/50 mt-1">vs last month</div>
            </div>
          </div>

          <!-- Orders Card -->
          <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div class="badge badge-success gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {{ financialData?.orders.change }}%
                </div>
              </div>
              <div class="stat-title text-base-content/60 text-sm">{{ $t('dashboard.orders') }}</div>
              <div class="stat-value text-3xl font-bold text-yellow-600">{{ financialData?.orders.current }}</div>
              <div class="text-xs text-base-content/50 mt-1">vs last month</div>
            </div>
          </div>

          <!-- Services Card -->
          <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="badge badge-success gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {{ financialData?.services.change }}%
                </div>
              </div>
              <div class="stat-title text-base-content/60 text-sm">{{ $t('dashboard.services') }}</div>
              <div class="stat-value text-3xl font-bold text-green-600">{{ financialData?.services.current }}</div>
              <div class="text-xs text-base-content/50 mt-1">Active services</div>
            </div>
          </div>

          <!-- Total Value Card with gradient -->
          <div class="card bg-gradient-to-br from-purple-600 to-yellow-500 shadow-xl hover:shadow-2xl transition-all duration-300 text-white">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div class="badge badge-ghost bg-white/20 text-white border-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {{ financialData?.totalValue.change }}%
                </div>
              </div>
              <div class="text-white/80 text-sm">Total Value</div>
              <div class="text-4xl font-bold">${{ (financialData?.totalValue.current || 0).toLocaleString() }}</div>
              <div class="text-xs text-white/70 mt-1">All time earnings</div>
            </div>
          </div>
        </template>
      </div>

      <!-- Charts Section with ECharts -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <template v-if="loading">
          <SkeletonsChartSkeleton />
          <SkeletonsChartSkeleton />
          <SkeletonsChartSkeleton />
        </template>
        <template v-else>
          <!-- Revenue Chart -->
          <div class="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="card-title text-xl">Revenue Overview</h2>
                  <p class="text-sm text-base-content/60">Monthly revenue trends</p>
                </div>
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </label>
                  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Last 7 days</a></li>
                    <li><a>Last 30 days</a></li>
                    <li><a>Last 90 days</a></li>
                  </ul>
                </div>
              </div>
              <ClientOnly>
                <VChart
                    :option="revenueChartOptions"
                    class="h-64 w-full"
                    autoresize
                />
              </ClientOnly>
            </div>
          </div>

          <!-- Services Distribution Pie Chart -->
          <div class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <h2 class="card-title text-xl mb-4">Services Status</h2>
              <ClientOnly>
                <VChart
                    :option="servicesChartOptions"
                    class="h-64 w-full"
                    autoresize
                />
              </ClientOnly>
            </div>
          </div>
        </template>
      </div>

      <!-- Orders Bar Chart & Recent Services -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <template v-if="loading">
          <SkeletonsChartSkeleton />
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <div class="skeleton h-6 w-40 mb-4"></div>
              <div class="space-y-3">
                <SkeletonsServiceItemSkeleton v-for="i in 3" :key="i" />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <!-- Orders Chart -->
          <div class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <h2 class="card-title text-xl mb-4">Orders Activity</h2>
              <ClientOnly>
                <VChart
                    :option="ordersChartOptions"
                    class="h-64 w-full"
                    autoresize
                />
              </ClientOnly>
            </div>
          </div>

          <!-- Recent Services -->
          <div class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <h2 class="card-title text-xl">Recent Services</h2>
                <NuxtLink to="/marketplace" class="btn btn-ghost btn-sm">View All</NuxtLink>
              </div>
              <div class="space-y-3">
                <div v-for="service in recentServices" :key="service.id" class="flex items-center justify-between p-4 bg-base-200 hover:bg-base-300 rounded-xl transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="w-12 h-12 rounded-xl">
                        <img :src="service.image" :alt="service.title" class="object-cover" />
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-base-content">{{ service.title }}</p>
                      <p class="text-sm text-base-content/60">{{ service.provider.name }}</p>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <div class="badge badge-primary font-semibold">${{ service.price }}</div>
                    <div class="flex items-center gap-1 text-xs text-warning">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {{ service.rating }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Quick Actions with modern design -->
      <div class="card bg-base-100 shadow-xl border border-base-300">
        <div class="card-body">
          <h2 class="card-title text-xl mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <NuxtLink to="/marketplace" class="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-lg transition-all duration-300 border-2 border-purple-200 dark:border-purple-800">
              <div class="flex flex-col items-center text-center gap-3">
                <div class="w-14 h-14 rounded-full bg-purple-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-base-content">Browse Marketplace</h3>
                  <p class="text-xs text-base-content/60 mt-1">Discover new services</p>
                </div>
              </div>
            </NuxtLink>

            <NuxtLink to="/messages" class="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 hover:shadow-lg transition-all duration-300 border-2 border-yellow-200 dark:border-yellow-800">
              <div class="flex flex-col items-center text-center gap-3">
                <div class="w-14 h-14 rounded-full bg-yellow-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-base-content">View Messages</h3>
                  <p class="text-xs text-base-content/60 mt-1">Chat with clients</p>
                </div>
              </div>
            </NuxtLink>

            <button class="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:shadow-lg transition-all duration-300 border-2 border-green-200 dark:border-green-800">
              <div class="flex flex-col items-center text-center gap-3">
                <div class="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-base-content">Add New Service</h3>
                  <p class="text-xs text-base-content/60 mt-1">Create a listing</p>
                </div>
              </div>
            </button>

            <NuxtLink to="/settings" class="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-lg transition-all duration-300 border-2 border-blue-200 dark:border-blue-800">
              <div class="flex flex-col items-center text-center gap-3">
                <div class="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-base-content">Settings</h3>
                  <p class="text-xs text-base-content/60 mt-1">Manage account</p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>