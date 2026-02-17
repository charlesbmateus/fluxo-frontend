<script setup lang="ts">
import { useClientDashboardStore } from '~/stores/clientDashboard'

const { user } = useAuth()
const store = useClientDashboardStore()
const { fetchServices } = useApi()

const loading = ref(true)
const fallbackServices = ref<any[]>([])

onMounted(async () => {
  loading.value = true
  try {
    await store.fetchClientDashboardData()
    // If no bookings, fetch top services from marketplace as fallback
    if (!store.hasBookings && store.topServices.length === 0) {
      const servicesData = await fetchServices()
      fallbackServices.value = servicesData.data.data
        .sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 6)
    }
  } catch {
    // If the client endpoint fails, load marketplace services as fallback
    try {
      const servicesData = await fetchServices()
      fallbackServices.value = servicesData.data.data
        .sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 6)
    } catch {
      // silent fail
    }
  } finally {
    loading.value = false
  }
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const displayedServices = computed(() => {
  if (store.topServices.length > 0) return store.topServices
  return fallbackServices.value
})

const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'badge-success'
    case 'pending': return 'badge-warning'
    case 'completed': return 'badge-info'
    case 'cancelled': return 'badge-error'
    default: return 'badge-ghost'
  }
}

// Calendar logic
const currentMonth = ref(new Date())

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const days: { date: Date; isCurrentMonth: boolean; bookings: any[] }[] = []

  // Previous month padding
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d, isCurrentMonth: false, bookings: [] })
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({
      date,
      isCurrentMonth: true,
      bookings: store.bookingsByDate[dateKey] || []
    })
  }

  // Next month padding to complete the grid
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d)
      days.push({ date, isCurrentMonth: false, bookings: [] })
    }
  }

  return days
})

const monthLabel = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const prevMonth = () => {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() - 1)
  currentMonth.value = d
}

const nextMonth = () => {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() + 1)
  currentMonth.value = d
}

const isToday = (date: Date) => {
  const today = new Date()
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="relative">
      <div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
      <div class="relative z-1">
        <h1 class="text-3xl font-bold mb-2">{{ greeting }}, {{ user?.name || 'there' }}! 👋</h1>
        <p>Here's an overview of your bookings and services</p>
      </div>
    </div>

    <!-- Top Row: Wallet + Upcoming Bookings Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <template v-if="loading">
        <SkeletonsStatCardSkeleton v-for="i in 3" :key="i" />
      </template>
      <template v-else>
        <!-- Wallet Balance Card -->
        <div class="card bg-gradient-to-br from-purple-600 to-yellow-500 shadow-xl hover:shadow-2xl transition-all duration-300 text-white">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
              </div>
            </div>
            <div class="text-white/80 text-sm">{{ $t('clientDashboard.walletBalance') }}</div>
            <div class="text-4xl font-bold">{{ formatCurrency(store.walletBalance, store.walletCurrency) }}</div>
            <div class="text-xs text-white/70 mt-1">{{ $t('clientDashboard.availableFunds') }}</div>
          </div>
        </div>

        <!-- Total Bookings Card -->
        <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="stat-title text-base-content/60 text-sm">{{ $t('clientDashboard.totalBookings') }}</div>
            <div class="stat-value text-3xl font-bold text-purple-600">{{ store.bookings.length }}</div>
            <div class="text-xs text-base-content/50 mt-1">{{ $t('clientDashboard.allTime') }}</div>
          </div>
        </div>

        <!-- Upcoming Bookings Card -->
        <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="stat-title text-base-content/60 text-sm">{{ $t('clientDashboard.upcoming') }}</div>
            <div class="stat-value text-3xl font-bold text-green-600">{{ store.upcomingBookings.length }}</div>
            <div class="text-xs text-base-content/50 mt-1">{{ $t('clientDashboard.scheduledServices') }}</div>
          </div>
        </div>
      </template>
    </div>

    <!-- Main Content: Bookings/Services + Calendar -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Booked Services or Top Ranked Services -->
      <div class="lg:col-span-2">
        <template v-if="loading">
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
          <!-- My Bookings Section (if user has bookings) -->
          <div v-if="store.hasBookings" class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <h2 class="card-title text-xl">{{ $t('clientDashboard.myBookings') }}</h2>
              </div>
              <div class="space-y-3">
                <div
                  v-for="booking in store.bookings"
                  :key="booking.id"
                  class="flex items-center justify-between p-4 bg-base-200 hover:bg-base-300 rounded-xl transition-colors cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <img v-if="booking.service_image" :src="booking.service_image" :alt="booking.service_title" class="object-cover" />
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-base-content">{{ booking.service_title }}</p>
                      <p class="text-sm text-base-content/60">{{ booking.provider_name }}</p>
                      <p class="text-xs text-base-content/50">{{ formatDate(booking.date) }} · {{ formatTime(booking.date) }}</p>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <div class="badge badge-primary font-semibold">{{ formatCurrency(booking.price) }}</div>
                    <div :class="['badge badge-sm', statusColor(booking.status)]">{{ booking.status }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Best Ranking Services (if no bookings) -->
          <div v-else class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="card-title text-xl">{{ $t('clientDashboard.topServices') }}</h2>
                  <p class="text-sm text-base-content/60">{{ $t('clientDashboard.topServicesSubtitle') }}</p>
                </div>
                <NuxtLink to="/marketplace" class="btn btn-ghost btn-sm">{{ $t('clientDashboard.viewAll') }}</NuxtLink>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NuxtLink
                  v-for="service in displayedServices"
                  :key="service.id"
                  :to="`/service/${service.id}`"
                  class="flex items-center gap-3 p-4 bg-base-200 hover:bg-base-300 rounded-xl transition-colors"
                >
                  <div class="avatar">
                    <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <img v-if="service.image" :src="service.image" :alt="service.title" class="object-cover" />
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-base-content truncate">{{ service.title }}</p>
                    <p class="text-xs text-base-content/60">{{ service.provider_name || service.category_name }}</p>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <div class="badge badge-primary font-semibold">{{ formatCurrency(Number(service.price)) }}</div>
                    <div v-if="service.rating" class="flex items-center gap-1 text-xs text-warning">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {{ service.rating }}
                    </div>
                  </div>
                </NuxtLink>
              </div>

              <!-- Empty state -->
              <div v-if="displayedServices.length === 0" class="flex flex-col items-center justify-center py-12 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p class="text-sm text-base-content/60 font-medium mb-1">{{ $t('clientDashboard.noServicesFound') }}</p>
                <NuxtLink to="/marketplace" class="btn btn-primary btn-sm mt-2">
                  {{ $t('clientDashboard.browseMarketplace') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Right: Calendar -->
      <div>
        <template v-if="loading">
          <SkeletonsChartSkeleton />
        </template>
        <template v-else>
          <div class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <h2 class="card-title text-lg">{{ $t('clientDashboard.calendar') }}</h2>
                <div class="flex gap-1">
                  <button @click="prevMonth" class="btn btn-ghost btn-xs btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button @click="nextMonth" class="btn btn-ghost btn-xs btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-base-content/60 mb-3 text-center font-medium">{{ monthLabel }}</p>

              <!-- Day headers -->
              <div class="grid grid-cols-7 gap-1 text-center text-xs text-base-content/50 mb-1">
                <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">{{ day }}</div>
              </div>

              <!-- Calendar grid -->
              <div class="grid grid-cols-7 gap-1">
                <div
                  v-for="(day, idx) in calendarDays"
                  :key="idx"
                  class="aspect-square flex flex-col items-center justify-center rounded-lg text-xs relative"
                  :class="{
                    'text-base-content/30': !day.isCurrentMonth,
                    'bg-primary/10 font-bold text-primary': isToday(day.date),
                    'hover:bg-base-200 cursor-pointer': day.isCurrentMonth
                  }"
                >
                  <span>{{ day.date.getDate() }}</span>
                  <div v-if="day.bookings.length > 0" class="absolute bottom-0.5 flex gap-0.5">
                    <span
                      v-for="(b, bi) in day.bookings.slice(0, 3)"
                      :key="bi"
                      class="w-1 h-1 rounded-full"
                      :class="{
                        'bg-warning': b.status === 'pending',
                        'bg-success': b.status === 'confirmed',
                        'bg-info': b.status === 'completed',
                        'bg-error': b.status === 'cancelled'
                      }"
                    ></span>
                  </div>
                </div>
              </div>

              <!-- Upcoming bookings list under calendar -->
              <div v-if="store.upcomingBookings.length > 0" class="mt-4 space-y-2">
                <h3 class="text-sm font-semibold text-base-content/70">{{ $t('clientDashboard.upcoming') }}</h3>
                <div
                  v-for="booking in store.upcomingBookings.slice(0, 3)"
                  :key="booking.id"
                  class="flex items-center gap-2 p-2 bg-base-200 rounded-lg text-xs"
                >
                  <div :class="['w-2 h-2 rounded-full flex-shrink-0', statusColor(booking.status).replace('badge-', 'bg-')]"></div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium truncate">{{ booking.service_title }}</p>
                    <p class="text-base-content/50">{{ formatDate(booking.date) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card bg-base-100 shadow-xl border border-base-300">
      <div class="card-body">
        <h2 class="card-title text-xl mb-4">{{ $t('clientDashboard.quickActions') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink to="/marketplace" class="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-lg transition-all duration-300 border-2 border-purple-200 dark:border-purple-800">
            <div class="flex flex-col items-center text-center gap-3">
              <div class="w-14 h-14 rounded-full bg-purple-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-base-content">{{ $t('clientDashboard.browseServices') }}</h3>
                <p class="text-xs text-base-content/60 mt-1">{{ $t('clientDashboard.discoverServices') }}</p>
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
                <h3 class="font-semibold text-base-content">{{ $t('clientDashboard.viewMessages') }}</h3>
                <p class="text-xs text-base-content/60 mt-1">{{ $t('clientDashboard.chatProviders') }}</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink to="/notifications" class="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:shadow-lg transition-all duration-300 border-2 border-green-200 dark:border-green-800">
            <div class="flex flex-col items-center text-center gap-3">
              <div class="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-base-content">{{ $t('clientDashboard.notifications') }}</h3>
                <p class="text-xs text-base-content/60 mt-1">{{ $t('clientDashboard.stayUpdated') }}</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink to="/settings" class="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-lg transition-all duration-300 border-2 border-blue-200 dark:border-blue-800">
            <div class="flex flex-col items-center text-center gap-3">
              <div class="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-base-content">{{ $t('clientDashboard.settings') }}</h3>
                <p class="text-xs text-base-content/60 mt-1">{{ $t('clientDashboard.manageAccount') }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
