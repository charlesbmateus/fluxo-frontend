<script setup lang="ts">
import { useClientDashboardStore } from '~/stores/clientDashboard'

const { user } = useAuth()
const { locale } = useI18n()
const store = useClientDashboardStore()

const loading = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    await store.fetchClientDashboardData()
  } catch {
    // silent fail
  } finally {
    loading.value = false
  }
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(locale.value, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString(locale.value, {
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
  return currentMonth.value.toLocaleDateString(locale.value, { month: 'long', year: 'numeric' })
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

const selectedDay = ref<{ date: Date; isCurrentMonth: boolean; bookings: any[] } | null>(null)

const selectDay = (day: { date: Date; isCurrentMonth: boolean; bookings: any[] }) => {
  if (day.isCurrentMonth) {
    selectedDay.value = day
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="relative">
        <div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div class="relative z-1">
          <h1 class="text-3xl font-bold mb-2">{{ $t('clientDashboard.calendar') }}</h1>
          <p class="text-base-content/60">{{ $t('availability.subtitle') }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Calendar -->
        <div class="lg:col-span-2">
          <template v-if="loading">
            <SkeletonsChartSkeleton />
          </template>
          <template v-else>
            <div class="card bg-base-100 shadow-xl border border-base-300">
              <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="card-title text-xl">{{ monthLabel }}</h2>
                  <div class="flex gap-1">
                    <button @click="prevMonth" class="btn btn-ghost btn-sm btn-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button @click="nextMonth" class="btn btn-ghost btn-sm btn-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Day headers -->
                <div class="grid grid-cols-7 gap-1 text-center text-sm font-medium text-base-content/60 mb-2">
                  <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">{{ day }}</div>
                </div>

                <!-- Calendar grid -->
                <div class="grid grid-cols-7 gap-1">
                  <div
                    v-for="(day, idx) in calendarDays"
                    :key="idx"
                    class="aspect-square flex flex-col items-center justify-center rounded-xl text-sm relative cursor-pointer transition-colors"
                    :class="{
                      'text-base-content/30': !day.isCurrentMonth,
                      'bg-primary/10 font-bold text-primary ring-2 ring-primary/30': isToday(day.date),
                      'hover:bg-base-200': day.isCurrentMonth,
                      'bg-base-200 ring-2 ring-primary': selectedDay?.date.getTime() === day.date.getTime() && day.isCurrentMonth
                    }"
                    @click="selectDay(day)"
                  >
                    <span>{{ day.date.getDate() }}</span>
                    <div v-if="day.bookings.length > 0" class="absolute bottom-1 flex gap-0.5">
                      <span
                        v-for="(b, bi) in day.bookings.slice(0, 3)"
                        :key="bi"
                        class="w-1.5 h-1.5 rounded-full"
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

                <!-- Legend -->
                <div class="flex flex-wrap gap-4 mt-4 pt-4 border-t border-base-300">
                  <div class="flex items-center gap-2 text-xs text-base-content/60">
                    <span class="w-2.5 h-2.5 rounded-full bg-warning"></span>
                    {{ $t('availability.pending') }}
                  </div>
                  <div class="flex items-center gap-2 text-xs text-base-content/60">
                    <span class="w-2.5 h-2.5 rounded-full bg-success"></span>
                    {{ $t('availability.confirmed') }}
                  </div>
                  <div class="flex items-center gap-2 text-xs text-base-content/60">
                    <span class="w-2.5 h-2.5 rounded-full bg-info"></span>
                    {{ $t('availability.completed') }}
                  </div>
                  <div class="flex items-center gap-2 text-xs text-base-content/60">
                    <span class="w-2.5 h-2.5 rounded-full bg-error"></span>
                    {{ $t('availability.cancelled') }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Sidebar: Selected Day Details + Upcoming Bookings -->
        <div class="space-y-6">
          <!-- Selected Day Bookings -->
          <template v-if="loading">
            <SkeletonsChartSkeleton />
          </template>
          <template v-else>
            <div v-if="selectedDay && selectedDay.bookings.length > 0" class="card bg-base-100 shadow-xl border border-base-300">
              <div class="card-body">
                <h3 class="card-title text-lg">{{ formatDate(selectedDay.date.toISOString()) }}</h3>
                <div class="space-y-3 mt-2">
                  <div
                    v-for="booking in selectedDay.bookings"
                    :key="booking.id"
                    class="flex items-center justify-between p-3 bg-base-200 rounded-xl"
                  >
                    <div class="flex items-center gap-3">
                      <div class="avatar">
                        <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <img v-if="booking.service_image" :src="booking.service_image" :alt="booking.service_title" class="object-cover" />
                          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p class="font-semibold text-sm">{{ booking.service_title }}</p>
                        <p class="text-xs text-base-content/60">{{ formatTime(booking.date) }}</p>
                      </div>
                    </div>
                    <div :class="['badge badge-sm', statusColor(booking.status)]">{{ booking.status }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upcoming Bookings -->
            <div class="card bg-base-100 shadow-xl border border-base-300">
              <div class="card-body">
                <h3 class="card-title text-lg">{{ $t('clientDashboard.upcoming') }}</h3>
                <div v-if="store.upcomingBookings.length > 0" class="space-y-3 mt-2">
                  <div
                    v-for="booking in store.upcomingBookings.slice(0, 5)"
                    :key="booking.id"
                    class="flex items-center gap-3 p-3 bg-base-200 rounded-xl"
                  >
                    <div :class="['w-2.5 h-2.5 rounded-full flex-shrink-0', statusColor(booking.status).replace('badge-', 'bg-')]"></div>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-sm truncate">{{ booking.service_title }}</p>
                      <p class="text-xs text-base-content/50">{{ formatDate(booking.date) }} · {{ formatTime(booking.date) }}</p>
                    </div>
                    <div :class="['badge badge-sm', statusColor(booking.status)]">{{ booking.status }}</div>
                  </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-content/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-sm text-base-content/60">{{ $t('availability.noUpcoming') }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
