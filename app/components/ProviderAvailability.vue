<script setup lang="ts">
import { useAvailabilityStore } from '~/stores/availability'
import type { AvailabilitySlot } from '~/types/availability'

const { t } = useI18n()
const store = useAvailabilityStore()

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const selectedDate = ref<string | null>(null)
const showAddModal = ref(false)
const editingSlot = ref<AvailabilitySlot | null>(null)

const newSlot = ref({ start_time: '09:00', end_time: '10:00' })

const monthLabel = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const monthParam = computed(() => {
  const m = String(currentMonth.value + 1).padStart(2, '0')
  return `${currentYear.value}-${m}`
})

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfWeek = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const calendarDays = computed(() => {
  const days: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek.value; i++) {
    days.push(null)
  }
  for (let d = 1; d <= daysInMonth.value; d++) {
    days.push(d)
  }
  return days
})

const slotsForSelectedDate = computed(() => {
  if (!selectedDate.value) return []
  return store.slotsByDate[selectedDate.value] || []
})

function formatDateKey(day: number): string {
  const m = String(currentMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${currentYear.value}-${m}-${d}`
}

function hasSlots(day: number): boolean {
  return !!store.slotsByDate[formatDateKey(day)]?.length
}

function isToday(day: number): boolean {
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  )
}

function isPast(day: number): boolean {
  const date = new Date(currentYear.value, currentMonth.value, day)
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return date < todayStart
}

function selectDay(day: number | null) {
  if (!day || isPast(day)) return
  selectedDate.value = formatDateKey(day)
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  selectedDate.value = null
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  selectedDate.value = null
}

function openAddModal() {
  editingSlot.value = null
  newSlot.value = { start_time: '09:00', end_time: '10:00' }
  showAddModal.value = true
}

function openEditModal(slot: AvailabilitySlot) {
  editingSlot.value = slot
  newSlot.value = { start_time: slot.start_time, end_time: slot.end_time }
  showAddModal.value = true
}

function closeModal() {
  showAddModal.value = false
  editingSlot.value = null
}

async function saveSlot() {
  if (!selectedDate.value) return

  try {
    if (editingSlot.value) {
      await store.updateSlot(editingSlot.value.id, {
        start_time: newSlot.value.start_time,
        end_time: newSlot.value.end_time,
      })
    } else {
      await store.addSlot({
        date: selectedDate.value,
        start_time: newSlot.value.start_time,
        end_time: newSlot.value.end_time,
      })
    }
    closeModal()
  } catch {
    // error is set in the store
  }
}

async function deleteSlot(id: number) {
  try {
    await store.removeSlot(id)
  } catch {
    // error is set in the store
  }
}

function formatTime(time: string): string {
  const [h, m] = time.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${m} ${ampm}`
}

// Fetch availability on mount and when month changes
watch(monthParam, (val) => {
  store.fetchSlots(val)
}, { immediate: true })
</script>

<template>
  <div class="card bg-base-100 shadow-xl border border-base-300">
    <div class="card-body">
      <h2 class="card-title text-xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ t('availability.title') }}
      </h2>
      <p class="text-sm text-base-content/60 mb-4">{{ t('availability.subtitle') }}</p>

      <!-- Error alert -->
      <div v-if="store.error" class="alert alert-error mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ store.error }}</span>
      </div>

      <!-- Calendar header -->
      <div class="flex items-center justify-between mb-4">
        <button class="btn btn-ghost btn-sm" @click="prevMonth">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="font-semibold text-lg">{{ monthLabel }}</span>
        <button class="btn btn-ghost btn-sm" @click="nextMonth">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="store.loading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg text-purple-600"></span>
      </div>

      <!-- Calendar grid -->
      <div v-else>
        <div class="grid grid-cols-7 gap-1 mb-1">
          <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day"
               class="text-center text-xs font-medium text-base-content/50 py-2">
            {{ day }}
          </div>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="aspect-square flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer transition-all duration-200"
            :class="{
              'hover:bg-base-200': day && !isPast(day),
              'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold': day && selectedDate === formatDateKey(day),
              'ring-2 ring-purple-500': day && isToday(day),
              'opacity-30 cursor-not-allowed': day && isPast(day),
              'cursor-default': !day,
            }"
            @click="selectDay(day)"
          >
            <span v-if="day">{{ day }}</span>
            <div v-if="day && hasSlots(day)" class="flex gap-0.5 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected date details -->
      <div v-if="selectedDate" class="mt-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold">
            {{ new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) }}
          </h3>
          <button class="btn btn-primary btn-sm gap-1" :disabled="store.saving" @click="openAddModal">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ t('availability.addSlot') }}
          </button>
        </div>

        <!-- Slots list -->
        <div v-if="slotsForSelectedDate.length" class="space-y-2">
          <div
            v-for="slot in slotsForSelectedDate"
            :key="slot.id"
            class="flex items-center justify-between p-3 bg-base-200 rounded-xl"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                   :class="slot.is_booked ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-medium">{{ formatTime(slot.start_time) }} – {{ formatTime(slot.end_time) }}</p>
                <p class="text-xs" :class="slot.is_booked ? 'text-warning' : 'text-success'">
                  {{ slot.is_booked ? t('availability.booked') : t('availability.available') }}
                </p>
              </div>
            </div>
            <div v-if="!slot.is_booked" class="flex gap-1">
              <button class="btn btn-ghost btn-sm btn-square" @click="openEditModal(slot)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button class="btn btn-ghost btn-sm btn-square text-error" :disabled="store.saving" @click="deleteSlot(slot.id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-6 text-base-content/50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm">{{ t('availability.noSlots') }}</p>
        </div>
      </div>

      <!-- No date selected hint -->
      <div v-else class="mt-6 text-center py-4 text-base-content/50">
        <p class="text-sm">{{ t('availability.selectDate') }}</p>
      </div>
    </div>
  </div>

  <!-- Add/Edit modal -->
  <dialog :class="{ 'modal modal-open': showAddModal, 'modal': !showAddModal }">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">
        {{ editingSlot ? t('availability.editSlot') : t('availability.addSlot') }}
      </h3>

      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">{{ t('availability.startTime') }}</span>
        </label>
        <input
          v-model="newSlot.start_time"
          type="time"
          class="input input-bordered w-full"
        />
      </div>

      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">{{ t('availability.endTime') }}</span>
        </label>
        <input
          v-model="newSlot.end_time"
          type="time"
          class="input input-bordered w-full"
        />
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="closeModal">{{ t('common.cancel') }}</button>
        <button
          class="btn btn-primary"
          :disabled="store.saving || !newSlot.start_time || !newSlot.end_time"
          @click="saveSlot"
        >
          <span v-if="store.saving" class="loading loading-spinner loading-sm"></span>
          {{ t('common.save') }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @click="closeModal">
      <button>close</button>
    </form>
  </dialog>
</template>
