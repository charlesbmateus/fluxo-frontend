<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, DateClickArg, DatesSetArg, EventInput } from '@fullcalendar/core'
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
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)

const currentMonth = ref(new Date())

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

const statusEventColor = (status: string) => {
  switch (status) {
    case 'confirmed': return '#36D399'
    case 'pending': return '#FBBD23'
    case 'completed': return '#3ABFF8'
    case 'cancelled': return '#F87272'
    default: return '#8B5CF6'
  }
}

// FullCalendar locale mapping
const fcLocale = computed(() => {
  const map: Record<string, string> = { en: 'en', de: 'de', it: 'it', fr: 'fr' }
  return map[locale.value] || 'en'
})

// Selected day state
const selectedDay = ref<{ dateKey: string; date: Date; bookings: any[] } | null>(null)

// Provider: calendar events from availability store
const providerEvents = computed<EventInput[]>(() => {
  const events: EventInput[] = []
  for (const [dateKey, slot] of Object.entries(availabilityStore.slots)) {
    if (slot.available) {
      events.push({
        id: `avail-${dateKey}`,
        start: dateKey,
        allDay: true,
        display: 'background',
        backgroundColor: '#36D399',
        classNames: ['fc-available-day']
      })
      // Show time slots as small events
      for (const ts of slot.time_slots) {
        events.push({
          id: `slot-${dateKey}-${ts.start}`,
          title: `${ts.start} – ${ts.end}`,
          start: `${dateKey}T${ts.start}`,
          end: `${dateKey}T${ts.end}`,
          backgroundColor: '#8B5CF6',
          borderColor: '#8B5CF6',
          classNames: ['fc-slot-event']
        })
      }
    }
  }
  return events
})

// Client: calendar events from bookings
const clientEvents = computed<EventInput[]>(() => {
  const events: EventInput[] = []
  if (!clientStore.bookingsByDate) return events
  for (const [dateKey, bookings] of Object.entries(clientStore.bookingsByDate)) {
    for (const booking of bookings as any[]) {
      events.push({
        id: `booking-${booking.id}`,
        title: booking.service_title,
        start: booking.date,
        backgroundColor: statusEventColor(booking.status),
        borderColor: statusEventColor(booking.status),
        extendedProps: { status: booking.status }
      })
    }
  }
  return events
})

const calendarEvents = computed(() => {
  return isProvider.value ? providerEvents.value : clientEvents.value
})

// Handle date click
const handleDateClick = (info: DateClickArg) => {
  const dateKey = info.dateStr
  if (isProvider.value) {
    availabilityStore.toggleDay(dateKey)
    selectedDay.value = { dateKey, date: info.date, bookings: [] }
  } else {
    const bookings = clientStore.bookingsByDate?.[dateKey] || []
    selectedDay.value = { dateKey, date: info.date, bookings }
  }
}

// Handle month navigation
const handleDatesSet = (info: DatesSetArg) => {
  const viewStart = info.view.currentStart
  currentMonth.value = viewStart
  if (isProvider.value) {
    const monthKey = `${viewStart.getFullYear()}-${String(viewStart.getMonth() + 1).padStart(2, '0')}`
    availabilityStore.fetchAvailability(monthKey).catch(() => {})
  }
}

// FullCalendar options
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: fcLocale.value,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: ''
  },
  events: calendarEvents.value,
  dateClick: handleDateClick,
  datesSet: handleDatesSet,
  height: 'auto',
  dayMaxEvents: 3,
  fixedWeekCount: false,
  nowIndicator: true,
  selectable: false,
  editable: false
}))

// Provider availability logic
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
              <div class="card-body fc-themed">
                <!-- Provider hint -->
                <p v-if="isProvider" class="text-sm text-base-content/50 mb-3">
                  {{ $t('availability.clickToToggle') }}
                </p>

                <FullCalendar ref="calendarRef" :options="calendarOptions" />

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

<style>
/* FullCalendar theme integration with DaisyUI light/dark mode */
.fc-themed {
  --fc-border-color: oklch(var(--bc) / 0.15);
  --fc-button-bg-color: #8B5CF6;
  --fc-button-border-color: #8B5CF6;
  --fc-button-hover-bg-color: #7C3AED;
  --fc-button-hover-border-color: #7C3AED;
  --fc-button-active-bg-color: #6D28D9;
  --fc-button-active-border-color: #6D28D9;
  --fc-today-bg-color: oklch(var(--p) / 0.08);
  --fc-neutral-bg-color: oklch(var(--b2, var(--b1)) / 1);
  --fc-page-bg-color: transparent;
  --fc-event-border-color: #8B5CF6;
  --fc-event-bg-color: #8B5CF6;
  --fc-event-text-color: #fff;
}

/* Calendar header toolbar */
.fc-themed .fc-toolbar-title {
  font-size: 1.25rem !important;
  font-weight: 700 !important;
  color: oklch(var(--bc));
}

.fc-themed .fc-button {
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  text-transform: capitalize !important;
  padding: 0.4rem 1rem !important;
  font-size: 0.875rem !important;
  box-shadow: none !important;
  transition: all 0.15s ease !important;
}

.fc-themed .fc-button:focus {
  box-shadow: 0 0 0 3px oklch(var(--p) / 0.3) !important;
}

.fc-themed .fc-prev-button,
.fc-themed .fc-next-button {
  padding: 0.4rem 0.6rem !important;
}

.fc-themed .fc-toolbar.fc-header-toolbar {
  margin-bottom: 1.25rem !important;
}

/* Day grid cells */
.fc-themed .fc-daygrid-day {
  transition: background-color 0.15s ease;
  cursor: pointer;
}

.fc-themed .fc-daygrid-day:hover {
  background-color: oklch(var(--p) / 0.06) !important;
}

.fc-themed .fc-daygrid-day-number {
  color: oklch(var(--bc));
  font-weight: 500;
  padding: 0.5rem !important;
}

.fc-themed .fc-day-other .fc-daygrid-day-number {
  color: oklch(var(--bc) / 0.35);
}

/* Today highlight */
.fc-themed .fc-day-today {
  background-color: oklch(var(--p) / 0.08) !important;
}

.fc-themed .fc-day-today .fc-daygrid-day-number {
  background-color: #8B5CF6;
  color: #fff !important;
  border-radius: 0.5rem;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* Column headers (day names) */
.fc-themed .fc-col-header-cell {
  padding: 0.75rem 0 !important;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: oklch(var(--bc) / 0.5);
  border-bottom: 2px solid oklch(var(--bc) / 0.1);
  background: transparent;
}

.fc-themed .fc-col-header-cell-cushion {
  color: oklch(var(--bc) / 0.5);
  text-decoration: none !important;
}

/* Table borders */
.fc-themed .fc-scrollgrid {
  border: none !important;
}

.fc-themed .fc-scrollgrid td,
.fc-themed .fc-scrollgrid th {
  border-color: oklch(var(--bc) / 0.08) !important;
}

/* Event styling */
.fc-themed .fc-daygrid-event {
  border-radius: 0.375rem !important;
  font-size: 0.7rem !important;
  padding: 1px 4px !important;
  font-weight: 500;
  border: none !important;
}

.fc-themed .fc-daygrid-dot-event {
  padding: 2px 4px !important;
}

.fc-themed .fc-daygrid-dot-event .fc-event-title {
  font-weight: 500;
}

/* Available day background */
.fc-themed .fc-available-day {
  opacity: 0.25 !important;
  border-radius: 0 !important;
}

/* Slot events */
.fc-themed .fc-slot-event {
  border-radius: 0.375rem !important;
  font-size: 0.7rem !important;
}

/* More link */
.fc-themed .fc-daygrid-more-link {
  color: #8B5CF6 !important;
  font-weight: 600;
  font-size: 0.75rem;
}

/* Remove default FullCalendar focus outlines for cleaner look */
.fc-themed .fc-daygrid-day-frame {
  min-height: 5rem;
}
</style>
