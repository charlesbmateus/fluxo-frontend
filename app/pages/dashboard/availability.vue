<script setup lang="ts">
import { useClientDashboardStore } from '~/stores/clientDashboard'
import { useAvailabilityStore } from '~/stores/availability'

const { user } = useAuth()
const { locale, t } = useI18n()
const clientStore = useClientDashboardStore()
const availabilityStore = useAvailabilityStore()

const isProvider = computed(() => user.value?.role === 'provider')

const loading = ref(true)
const saveSuccess = ref(false)
const saveError = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    if (isProvider.value) {
      const monthKey = `${currentMonth.value.getFullYear()}-${String(currentMonth.value.getMonth() + 1).padStart(2, '0')}`
      await availabilityStore.fetchAvailability(monthKey).catch(() => {})
    } else {
      await clientStore.fetchClientDashboardData()
    }
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

const getDateKey = (year: number, month: number, day: number) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const days: { date: Date; isCurrentMonth: boolean; bookings: any[]; dateKey: string }[] = []

  // Previous month padding
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d, isCurrentMonth: false, bookings: [], dateKey: '' })
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    const dateKey = getDateKey(year, month, d)
    days.push({
      date,
      isCurrentMonth: true,
      bookings: clientStore.bookingsByDate[dateKey] || [],
      dateKey
    })
  }

  // Next month padding to complete the grid
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d)
      days.push({ date, isCurrentMonth: false, bookings: [], dateKey: '' })
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
  if (isProvider.value) {
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    availabilityStore.fetchAvailability(monthKey).catch(() => {})
  }
}

const nextMonth = () => {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() + 1)
  currentMonth.value = d
  if (isProvider.value) {
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    availabilityStore.fetchAvailability(monthKey).catch(() => {})
  }
}

const isToday = (date: Date) => {
  const today = new Date()
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

const selectedDay = ref<{ date: Date; isCurrentMonth: boolean; bookings: any[]; dateKey: string } | null>(null)

const selectDay = (day: { date: Date; isCurrentMonth: boolean; bookings: any[]; dateKey: string }) => {
  if (day.isCurrentMonth) {
    selectedDay.value = day
  }
}

// Provider availability logic
const toggleDayAvailability = (day: { date: Date; isCurrentMonth: boolean; dateKey: string }) => {
  if (!day.isCurrentMonth || !isProvider.value) return
  availabilityStore.toggleDay(day.dateKey)
  selectedDay.value = { ...day, bookings: [] }
}

const addNewTimeSlot = () => {
  if (!selectedDay.value) return
  availabilityStore.addTimeSlot(selectedDay.value.dateKey, { start: '09:00', end: '10:00' })
}

const removeSlot = (index: number) => {
  if (!selectedDay.value) return
  availabilityStore.removeTimeSlot(selectedDay.value.dateKey, index)
}

const updateSlotTime = (index: number, field: 'start' | 'end', value: string) => {
  if (!selectedDay.value) return
  const slots = availabilityStore.getTimeSlots(selectedDay.value.dateKey)
  const current = slots[index]
  if (!current) return
  availabilityStore.updateTimeSlot(selectedDay.value.dateKey, index, {
    ...current,
    [field]: value
  })
}

const saveAvailability = async () => {
  saveSuccess.value = false
  saveError.value = false
  try {
    await availabilityStore.saveAvailability()
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 3000)
  } catch {
    saveError.value = true
    setTimeout(() => { saveError.value = false }, 3000)
  }
}

const isDayAvailable = (dateKey: string) => {
  return availabilityStore.isAvailable(dateKey)
}

const selectedDayTimeSlots = computed(() => {
  if (!selectedDay.value) return []
  return availabilityStore.getTimeSlots(selectedDay.value.dateKey)
})

const selectedDayAvailable = computed(() => {
  if (!selectedDay.value) return false
  return availabilityStore.isAvailable(selectedDay.value.dateKey)
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="relative">
        <div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div class="relative z-1">
          <h1 class="text-3xl font-bold mb-2">
            {{ isProvider ? $t('availability.manageAvailability') : $t('clientDashboard.calendar') }}
          </h1>
          <p class="text-base-content/60">
            {{ isProvider ? $t('availability.availabilitySubtitle') : $t('availability.subtitle') }}
          </p>
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

                <!-- Provider hint -->
                <p v-if="isProvider" class="text-sm text-base-content/50 mb-3">
                  {{ $t('availability.clickToToggle') }}
                </p>

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
                      'bg-primary/10 font-bold text-primary ring-2 ring-primary/30': isToday(day.date) && !isDayAvailable(day.dateKey),
                      'hover:bg-base-200': day.isCurrentMonth && !isProvider,
                      'hover:bg-success/20': day.isCurrentMonth && isProvider && !isDayAvailable(day.dateKey),
                      'hover:bg-error/20': day.isCurrentMonth && isProvider && isDayAvailable(day.dateKey),
                      'bg-base-200 ring-2 ring-primary': selectedDay?.date.getTime() === day.date.getTime() && day.isCurrentMonth && !isProvider,
                      'bg-success/15 text-success-content ring-2 ring-success/40': isProvider && day.isCurrentMonth && isDayAvailable(day.dateKey),
                      'ring-2 ring-primary': isProvider && selectedDay?.dateKey === day.dateKey && day.isCurrentMonth
                    }"
                    @click="isProvider ? toggleDayAvailability(day) : selectDay(day)"
                  >
                    <span>{{ day.date.getDate() }}</span>
                    <!-- Client: booking indicators -->
                    <div v-if="!isProvider && day.bookings.length > 0" class="absolute bottom-1 flex gap-0.5">
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
                    <!-- Provider: availability indicator -->
                    <div v-if="isProvider && day.isCurrentMonth && isDayAvailable(day.dateKey)" class="absolute bottom-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Legend -->
                <div class="flex flex-wrap gap-4 mt-4 pt-4 border-t border-base-300">
                  <template v-if="isProvider">
                    <div class="flex items-center gap-2 text-xs text-base-content/60">
                      <span class="w-2.5 h-2.5 rounded-full bg-success"></span>
                      {{ $t('availability.available') }}
                    </div>
                    <div class="flex items-center gap-2 text-xs text-base-content/60">
                      <span class="w-2.5 h-2.5 rounded-full bg-base-300"></span>
                      {{ $t('availability.unavailable') }}
                    </div>
                  </template>
                  <template v-else>
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
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <template v-if="loading">
            <SkeletonsChartSkeleton />
          </template>
          <template v-else>
            <!-- Provider: Time Slots Editor for selected day -->
            <template v-if="isProvider">
              <div v-if="selectedDay" class="card bg-base-100 shadow-xl border border-base-300">
                <div class="card-body">
                  <div class="flex items-center justify-between">
                    <h3 class="card-title text-lg">{{ formatDate(selectedDay.date.toISOString()) }}</h3>
                    <div :class="['badge', selectedDayAvailable ? 'badge-success' : 'badge-ghost']">
                      {{ selectedDayAvailable ? $t('availability.available') : $t('availability.unavailable') }}
                    </div>
                  </div>

                  <template v-if="selectedDayAvailable">
                    <h4 class="font-medium text-sm mt-4 mb-2">{{ $t('availability.timeSlots') }}</h4>

                    <div v-if="selectedDayTimeSlots.length > 0" class="space-y-2">
                      <div
                        v-for="(slot, idx) in selectedDayTimeSlots"
                        :key="idx"
                        class="flex items-center gap-2 p-2 bg-base-200 rounded-lg"
                      >
                        <div class="flex-1 flex items-center gap-2">
                          <label class="text-xs text-base-content/60">{{ $t('availability.from') }}</label>
                          <input
                            type="time"
                            :value="slot.start"
                            @input="updateSlotTime(idx, 'start', ($event.target as HTMLInputElement).value)"
                            class="input input-sm input-bordered flex-1"
                          />
                          <label class="text-xs text-base-content/60">{{ $t('availability.to') }}</label>
                          <input
                            type="time"
                            :value="slot.end"
                            @input="updateSlotTime(idx, 'end', ($event.target as HTMLInputElement).value)"
                            class="input input-sm input-bordered flex-1"
                          />
                        </div>
                        <button @click="removeSlot(idx)" class="btn btn-ghost btn-sm btn-circle text-error">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div v-else class="text-sm text-base-content/50 py-2">
                      {{ $t('availability.noSlotsConfigured') }}
                    </div>

                    <button @click="addNewTimeSlot" class="btn btn-outline btn-sm mt-2 w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      {{ $t('availability.addTimeSlot') }}
                    </button>
                  </template>
                  <template v-else>
                    <p class="text-sm text-base-content/50 mt-3">{{ $t('availability.clickToToggle') }}</p>
                  </template>
                </div>
              </div>

              <!-- Save Button -->
              <div class="card bg-base-100 shadow-xl border border-base-300">
                <div class="card-body">
                  <button
                    @click="saveAvailability"
                    class="btn btn-primary w-full"
                    :class="{ 'loading': availabilityStore.saving }"
                    :disabled="availabilityStore.saving"
                  >
                    <template v-if="!availabilityStore.saving">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ $t('availability.save') }}
                    </template>
                    <template v-else>
                      {{ $t('availability.saving') }}
                    </template>
                  </button>

                  <!-- Success message -->
                  <div v-if="saveSuccess" class="alert alert-success mt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">{{ $t('availability.saved') }}</span>
                  </div>

                  <!-- Error message -->
                  <div v-if="saveError" class="alert alert-error mt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span class="text-sm">{{ $t('availability.saveFailed') }}</span>
                  </div>
                </div>
              </div>
            </template>

            <!-- Client: Selected Day Bookings -->
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
                  <div v-if="clientStore.upcomingBookings.length > 0" class="space-y-3 mt-2">
                    <div
                      v-for="booking in clientStore.upcomingBookings.slice(0, 5)"
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
          </template>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
