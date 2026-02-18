<script setup lang="ts">
import { useServicesStore } from '~/stores/services'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()
const { t } = useI18n()

const store = useServicesStore()
const { loading } = storeToRefs(store)

// Redirect to login if not authenticated
watchEffect(() => {
  if (!isAuthenticated.value) {
    router.push(`/login?redirect=/book/${route.params.id}`)
  }
})

const service = computed(() => {
  const id = Number(route.params.id)
  return store.getById(id)
})

// Multi-step booking flow
const currentStep = ref(1)
const totalSteps = 3

// Step 1: Date & Time
const selectedDate = ref('')
const selectedTime = ref('')

// Step 2: Notes
const notes = ref('')

// Booking state
const submitting = ref(false)
const bookingSuccess = ref(false)
const bookingError = ref('')

// Format price in CHF
const formattedPrice = computed(() => {
  if (!service.value) return ''
  const price = parseFloat(service.value.price)
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(price)
})

const pricingLabel = computed(() => {
  if (!service.value) return ''
  return service.value.pricing_model === 'hourly'
    ? t('service.perHour')
    : t('service.perService')
})

// Generate available time slots
const timeSlots = computed(() => {
  const slots: string[] = []
  for (let h = 8; h <= 18; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`)
    if (h < 18) {
      slots.push(`${h.toString().padStart(2, '0')}:30`)
    }
  }
  return slots
})

// Minimum date for booking (tomorrow)
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// Format selected date for display
const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  return new Date(selectedDate.value).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// Validation
const canProceedStep1 = computed(() => !!selectedDate.value && !!selectedTime.value)
const canProceedStep2 = computed(() => true) // Notes are optional

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const goToStep = (step: number) => {
  if (step < currentStep.value) {
    currentStep.value = step
  }
}

const handleConfirmBooking = async () => {
  if (!service.value) return

  submitting.value = true
  bookingError.value = ''

  try {
    const auth = useAuthStore()
    if (!auth.token) throw new Error('Not authenticated')

    const api = useApi()
    await api.createBooking(auth.token, {
      service_id: service.value.id,
      date: selectedDate.value,
      time: selectedTime.value,
      notes: notes.value,
    })

    bookingSuccess.value = true
  } catch (error: any) {
    bookingError.value = error?.data?.message || error?.message || t('booking.errorGeneric')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (store.items.length === 0) {
    await store.fetchServices()
  }
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="max-w-4xl mx-auto py-4" v-if="service">

      <!-- Back button & Progress bar -->
      <div class="mb-6">
        <button @click="currentStep > 1 ? prevStep() : router.push(`/service/${service.id}`)" class="btn btn-ghost btn-sm mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {{ currentStep > 1 ? t('common.back') : t('booking.backToService') }}
        </button>

        <!-- Step progress indicator -->
        <div v-if="!bookingSuccess" class="flex items-center gap-2">
          <template v-for="step in totalSteps" :key="step">
            <button
              @click="goToStep(step)"
              class="flex items-center gap-2"
              :class="{ 'cursor-pointer': step < currentStep, 'cursor-default': step >= currentStep }"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                :class="{
                  'bg-primary text-white': step === currentStep,
                  'bg-success text-white': step < currentStep,
                  'bg-base-300 text-base-content/50': step > currentStep,
                }"
              >
                <svg v-if="step < currentStep" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span v-else>{{ step }}</span>
              </div>
              <span
                class="text-sm font-medium hidden sm:inline"
                :class="{
                  'text-primary': step === currentStep,
                  'text-success': step < currentStep,
                  'text-base-content/50': step > currentStep,
                }"
              >
                {{ step === 1 ? t('booking.stepDateTime') : step === 2 ? t('booking.stepDetails') : t('booking.stepConfirm') }}
              </span>
            </button>
            <div v-if="step < totalSteps" class="flex-1 h-0.5 rounded" :class="step < currentStep ? 'bg-success' : 'bg-base-300'"></div>
          </template>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Left Column: Steps -->
        <div class="lg:col-span-3">

          <!-- STEP 1: Date & Time -->
          <div v-if="currentStep === 1 && !bookingSuccess">
            <h2 class="text-2xl font-bold mb-6">{{ t('booking.selectDateTime') }}</h2>

            <!-- Date picker -->
            <div class="mb-6">
              <label class="label">
                <span class="label-text font-semibold text-base">{{ t('booking.selectDate') }}</span>
              </label>
              <input
                v-model="selectedDate"
                type="date"
                :min="minDate"
                class="input input-bordered w-full"
              />
              <p v-if="selectedDate" class="text-sm text-base-content/60 mt-2">
                {{ formattedDate }}
              </p>
            </div>

            <!-- Time slots grid -->
            <div>
              <label class="label">
                <span class="label-text font-semibold text-base">{{ t('booking.selectTime') }}</span>
              </label>
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <button
                  v-for="slot in timeSlots"
                  :key="slot"
                  @click="selectedTime = slot"
                  class="btn btn-sm"
                  :class="selectedTime === slot ? 'btn-primary' : 'btn-outline'"
                >
                  {{ slot }}
                </button>
              </div>
            </div>

            <!-- Next button -->
            <div class="mt-8">
              <button @click="nextStep" class="btn btn-primary btn-block btn-lg" :disabled="!canProceedStep1">
                {{ t('booking.continue') }}
              </button>
            </div>
          </div>

          <!-- STEP 2: Notes -->
          <div v-if="currentStep === 2 && !bookingSuccess">
            <h2 class="text-2xl font-bold mb-6">{{ t('booking.addDetails') }}</h2>

            <div class="space-y-6">
              <!-- Notes textarea -->
              <div>
                <label class="label">
                  <span class="label-text font-semibold text-base">{{ t('booking.notesLabel') }}</span>
                </label>
                <textarea
                  v-model="notes"
                  class="textarea textarea-bordered w-full h-32"
                  :placeholder="t('booking.notesPlaceholder')"
                ></textarea>
                <p class="text-sm text-base-content/50 mt-1">{{ t('booking.notesHint') }}</p>
              </div>

              <!-- Quick selections -->
              <div>
                <p class="font-semibold text-sm mb-3">{{ t('booking.commonRequests') }}</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="tag in [t('booking.tagFlexible'), t('booking.tagUrgent'), t('booking.tagWeekend'), t('booking.tagOnline')]"
                    :key="tag"
                    @click="notes = notes ? `${notes}, ${tag}` : tag"
                    class="btn btn-outline btn-sm"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Navigation buttons -->
            <div class="mt-8 flex gap-3">
              <button @click="prevStep" class="btn btn-outline flex-1">
                {{ t('common.back') }}
              </button>
              <button @click="nextStep" class="btn btn-primary flex-1" :disabled="!canProceedStep2">
                {{ t('booking.continue') }}
              </button>
            </div>
          </div>

          <!-- STEP 3: Review & Confirm -->
          <div v-if="currentStep === 3 && !bookingSuccess">
            <h2 class="text-2xl font-bold mb-6">{{ t('booking.reviewBooking') }}</h2>

            <div class="space-y-4">
              <!-- Date & Time summary -->
              <div class="card bg-base-200 border border-base-300">
                <div class="card-body p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-base-content/60">{{ t('booking.dateAndTime') }}</p>
                      <p class="font-semibold">{{ formattedDate }}</p>
                      <p class="text-base-content/70">{{ selectedTime }}</p>
                    </div>
                    <button @click="goToStep(1)" class="btn btn-ghost btn-sm">{{ t('common.edit') }}</button>
                  </div>
                </div>
              </div>

              <!-- Notes summary -->
              <div class="card bg-base-200 border border-base-300">
                <div class="card-body p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-base-content/60">{{ t('booking.specialRequests') }}</p>
                      <p class="font-semibold">{{ notes || t('booking.noSpecialRequests') }}</p>
                    </div>
                    <button @click="goToStep(2)" class="btn btn-ghost btn-sm">{{ t('common.edit') }}</button>
                  </div>
                </div>
              </div>

              <!-- Price breakdown -->
              <div class="card bg-base-200 border border-base-300">
                <div class="card-body p-4">
                  <h3 class="font-semibold mb-3">{{ t('booking.priceDetails') }}</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-base-content/70">{{ service.title }}</span>
                      <span>{{ formattedPrice }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-base-content/70">{{ t('booking.serviceFee') }}</span>
                      <span>CHF 0.00</span>
                    </div>
                    <div class="divider my-1"></div>
                    <div class="flex justify-between font-bold text-base">
                      <span>{{ t('service.totalPrice') }}</span>
                      <span>{{ formattedPrice }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cancellation policy -->
              <div class="flex items-start gap-3 p-4 bg-base-200 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-info flex-shrink-0 mt-0.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p class="text-sm text-base-content/70">{{ t('booking.cancellationPolicy') }}</p>
              </div>
            </div>

            <!-- Error message -->
            <div v-if="bookingError" class="alert alert-error mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{{ bookingError }}</span>
            </div>

            <!-- Confirm button -->
            <div class="mt-8">
              <button @click="handleConfirmBooking" class="btn btn-primary btn-block btn-lg" :disabled="submitting">
                <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
                {{ submitting ? t('booking.processing') : t('booking.confirmAndPay') }}
              </button>
            </div>
          </div>

          <!-- SUCCESS STATE -->
          <div v-if="bookingSuccess" class="text-center py-12">
            <div class="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10 text-success">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold mb-2">{{ t('booking.bookingConfirmed') }}</h2>
            <p class="text-base-content/60 mb-2">{{ t('booking.confirmationMessage') }}</p>
            <div class="card bg-base-200 border border-base-300 inline-block mt-4 mb-6">
              <div class="card-body p-4 text-left">
                <p class="text-sm"><span class="font-semibold">{{ t('booking.service') }}:</span> {{ service.title }}</p>
                <p class="text-sm"><span class="font-semibold">{{ t('booking.dateAndTime') }}:</span> {{ formattedDate }} {{ t('booking.at') }} {{ selectedTime }}</p>
                <p class="text-sm"><span class="font-semibold">{{ t('service.totalPrice') }}:</span> {{ formattedPrice }}</p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button @click="router.push('/dashboard')" class="btn btn-primary">
                {{ t('booking.viewBookings') }}
              </button>
              <button @click="router.push('/marketplace')" class="btn btn-outline">
                {{ t('booking.browseMore') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Service summary card (sticky) -->
        <div class="lg:col-span-2">
          <div class="card bg-base-100 shadow-xl border border-base-300 sticky top-4">
            <div class="card-body p-4">
              <!-- Service thumbnail -->
              <div class="flex gap-4">
                <div class="w-24 h-24 rounded-lg overflow-hidden bg-base-300 flex-shrink-0">
                  <img
                    v-if="service.thumbnail"
                    :src="service.thumbnail"
                    :alt="service.title"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-base-content/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-base-content/50 uppercase tracking-wide">{{ service.category?.name }}</p>
                  <h3 class="font-semibold text-sm line-clamp-2">{{ service.title }}</h3>
                  <div class="flex items-center gap-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-secondary">
                      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs font-medium">{{ service.rating ?? 4.8 }}</span>
                    <span class="text-xs text-base-content/50">({{ service.reviews_count ?? 24 }})</span>
                  </div>
                </div>
              </div>

              <div class="divider my-2"></div>

              <!-- Price details -->
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-base-content/70">{{ t('service.price') }}</span>
                  <span>{{ formattedPrice }} {{ pricingLabel }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/70">{{ t('booking.serviceFee') }}</span>
                  <span>CHF 0.00</span>
                </div>
              </div>

              <div class="divider my-2"></div>

              <div class="flex justify-between font-bold">
                <span>{{ t('service.totalPrice') }}</span>
                <span>{{ formattedPrice }}</span>
              </div>

              <!-- Selected date/time display -->
              <div v-if="selectedDate || selectedTime" class="mt-3 p-3 bg-base-200 rounded-lg">
                <p v-if="selectedDate" class="text-sm">
                  <span class="font-semibold">{{ t('booking.date') }}:</span> {{ formattedDate }}
                </p>
                <p v-if="selectedTime" class="text-sm">
                  <span class="font-semibold">{{ t('booking.time') }}:</span> {{ selectedTime }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!service" class="flex justify-center items-center min-h-screen">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  </NuxtLayout>
</template>
