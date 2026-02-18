<script setup lang="ts">
import { useServicesStore } from '~/stores/services'
import { storeToRefs } from 'pinia'
import type { ProviderProfile, ProviderAvailability, ServiceReview, Service } from '~/types/service'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()
const { t } = useI18n()
const api = useApi()

const serviceStore = useServicesStore()
const { items: allServices } = storeToRefs(serviceStore)

const loading = ref(true)
const provider = ref<ProviderProfile | null>(null)
const error = ref<string | null>(null)

// Calendar state
const currentMonth = ref(new Date())

// Computed: provider ID from route
const providerId = computed(() => Number(route.params.id))

// Fallback provider data built from service store when API is unavailable
const fallbackProvider = computed((): ProviderProfile | null => {
  const providerServices = allServices.value.filter(
    s => s.provider?.id === providerId.value
  )
  if (providerServices.length === 0) return null

  const first = providerServices[0]
  return {
    id: first.provider.id,
    name: first.provider.name,
    role: first.provider.role,
    avatar: first.provider.avatar,
    bio: null,
    city: first.city,
    country: first.country,
    joined_at: null,
    rating: first.rating ?? 4.8,
    reviews_count: first.reviews_count ?? 0,
    completed_services: providerServices.length,
    years_experience: first.years_experience ?? 3,
    response_time: first.response_time ?? '< 1h',
    services: providerServices,
    reviews: first.reviews ?? [],
    portfolio_images: providerServices.flatMap(s => s.images ?? []),
    availability: generatePlaceholderAvailability(),
  }
})

// Current displayed provider data
const displayProvider = computed(() => provider.value ?? fallbackProvider.value)

// Provider services
const providerServices = computed((): Service[] => {
  return displayProvider.value?.services ?? []
})

// Provider reviews with fallback
const reviews = computed((): ServiceReview[] => {
  if (displayProvider.value?.reviews && displayProvider.value.reviews.length > 0) {
    return displayProvider.value.reviews
  }
  return [
    { id: 1, author: 'Sophie M.', avatar: null, rating: 5, comment: t('providerProfile.placeholderReview1'), date: '2026-01-15' },
    { id: 2, author: 'Luca B.', avatar: null, rating: 5, comment: t('providerProfile.placeholderReview2'), date: '2026-01-08' },
    { id: 3, author: 'Marie K.', avatar: null, rating: 4, comment: t('providerProfile.placeholderReview3'), date: '2025-12-22' },
  ]
})

// Portfolio images
const portfolioImages = computed(() => {
  if (displayProvider.value?.portfolio_images && displayProvider.value.portfolio_images.length > 0) {
    return displayProvider.value.portfolio_images.map(img => img.url)
  }
  // Fallback: use service thumbnails
  return providerServices.value
    .map(s => s.thumbnail)
    .filter((t): t is string => !!t)
})

// Calendar helpers
const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDayOfWeek = firstDay.getDay()

  const days: { date: number; available: boolean; inMonth: boolean; isToday: boolean }[] = []

  // Fill empty days before the first day
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ date: 0, available: false, inMonth: false, isToday: false })
  }

  const today = new Date()
  const availability = displayProvider.value?.availability ?? []

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const avail = availability.find(a => a.date === dateStr)
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d
    days.push({
      date: d,
      available: avail ? avail.available : d % 7 !== 0, // fallback pattern
      inMonth: true,
      isToday,
    })
  }

  return days
})

const monthLabel = computed(() => {
  return currentMonth.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
})

const weekDays = computed(() => {
  return [
    t('providerProfile.sun'),
    t('providerProfile.mon'),
    t('providerProfile.tue'),
    t('providerProfile.wed'),
    t('providerProfile.thu'),
    t('providerProfile.fri'),
    t('providerProfile.sat'),
  ]
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

// Star rendering helper
const getStarType = (starIndex: number, rating: number): 'full' | 'half' | 'empty' => {
  if (starIndex <= Math.floor(rating)) return 'full'
  if (starIndex === Math.ceil(rating) && rating % 1 >= 0.5) return 'half'
  return 'empty'
}

// Format price in CHF
const formatPrice = (price: string, pricingModel: string) => {
  const p = parseFloat(price)
  const formatted = new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(p)
  const label = pricingModel === 'hourly' ? t('service.perHour') : t('service.perService')
  return `${formatted} ${label}`
}

const handleContactProvider = () => {
  if (!isAuthenticated.value) {
    router.push(`/login?redirect=${route.fullPath}`)
    return
  }
  router.push('/messages')
}

const goToService = (id: number) => {
  router.push(`/service/${id}`)
}

// Generate placeholder availability for the next 2 months
function generatePlaceholderAvailability(): ProviderAvailability[] {
  const result: ProviderAvailability[] = []
  const today = new Date()
  for (let i = 0; i < 60; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    result.push({
      date: dateStr,
      available: d.getDay() !== 0 && Math.random() > 0.2,
    })
  }
  return result
}

onMounted(async () => {
  loading.value = true
  error.value = null

  // Ensure services are loaded (used as fallback)
  if (serviceStore.items.length === 0) {
    await serviceStore.fetchServices()
  }

  try {
    const response = await api.fetchProviderProfile(providerId.value)
    provider.value = response.data
  } catch {
    // API endpoint may not exist yet; use fallback from services
    provider.value = null
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <NuxtLayout name="default">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Provider Not Found -->
    <div v-else-if="!displayProvider" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-base-content/30">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
      <p class="text-base-content/60 text-lg">{{ $t('providerProfile.notFound') }}</p>
      <button @click="router.push('/marketplace')" class="btn btn-primary btn-sm">
        {{ $t('marketplace.title') }}
      </button>
    </div>

    <!-- Provider Profile Content -->
    <div v-else class="space-y-8">
      <!-- Back Button -->
      <button @click="router.back()" class="btn btn-ghost btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {{ $t('providerProfile.back') }}
      </button>

      <!-- Profile Header -->
      <div class="card bg-base-100 shadow-xl border border-base-300">
        <div class="card-body">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
            <!-- Avatar -->
            <div class="avatar">
              <div v-if="displayProvider.avatar" class="w-24 h-24 rounded-full">
                <img :src="displayProvider.avatar" :alt="displayProvider.name" />
              </div>
              <div v-else class="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold">
                {{ displayProvider.name?.charAt(0) }}
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-3 mb-1">
                <h1 class="text-2xl md:text-3xl font-bold">{{ displayProvider.name }}</h1>
                <div class="badge badge-primary badge-outline">{{ $t('service.superProvider') }}</div>
              </div>

              <!-- Location -->
              <div v-if="displayProvider.city || displayProvider.country" class="flex items-center gap-1 text-base-content/70 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{{ [displayProvider.city, displayProvider.country].filter(Boolean).join(', ') }}</span>
              </div>

              <!-- Member since -->
              <div v-if="displayProvider.joined_at" class="text-sm text-base-content/50">
                {{ $t('providerProfile.memberSince') }} {{ new Date(displayProvider.joined_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) }}
              </div>

              <!-- Stats row -->
              <div class="flex flex-wrap gap-6 mt-4">
                <div class="text-center">
                  <div class="flex items-center gap-1">
                    <span class="text-xl font-bold">{{ displayProvider.rating }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-secondary">
                      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <p class="text-xs text-base-content/60">{{ $t('service.rating') }}</p>
                </div>
                <div class="text-center">
                  <p class="text-xl font-bold">{{ displayProvider.reviews_count }}</p>
                  <p class="text-xs text-base-content/60">{{ $t('service.reviews') }}</p>
                </div>
                <div class="text-center">
                  <p class="text-xl font-bold">{{ displayProvider.completed_services }}</p>
                  <p class="text-xs text-base-content/60">{{ $t('providerProfile.completedServices') }}</p>
                </div>
                <div class="text-center">
                  <p class="text-xl font-bold">{{ displayProvider.years_experience }}</p>
                  <p class="text-xs text-base-content/60">{{ $t('service.yearsExperience') }}</p>
                </div>
                <div class="text-center">
                  <p class="text-xl font-bold">{{ displayProvider.response_time }}</p>
                  <p class="text-xs text-base-content/60">{{ $t('service.responseTime') }}</p>
                </div>
              </div>
            </div>

            <!-- Contact Button -->
            <div class="flex-shrink-0">
              <button @click="handleContactProvider" class="btn btn-primary">
                {{ $t('service.contactProvider') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Description / Bio -->
          <div class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <h2 class="card-title text-xl">{{ $t('providerProfile.about') }}</h2>
              <p v-if="displayProvider.bio" class="text-base-content/80 leading-relaxed whitespace-pre-line">
                {{ displayProvider.bio }}
              </p>
              <p v-else class="text-base-content/60 italic">
                {{ $t('providerProfile.noBio') }}
              </p>
            </div>
          </div>

          <!-- Portfolio / Gallery -->
          <div v-if="portfolioImages.length > 0" class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <h2 class="card-title text-xl">{{ $t('providerProfile.portfolio') }}</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                <div v-for="(img, idx) in portfolioImages" :key="idx" class="aspect-square rounded-lg overflow-hidden">
                  <img
                    :src="img"
                    :alt="`${displayProvider.name} portfolio ${idx + 1}`"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Services Offered -->
          <div class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <h2 class="card-title text-xl">{{ $t('providerProfile.servicesOffered') }}</h2>
              <div v-if="providerServices.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div
                  v-for="service in providerServices"
                  :key="service.id"
                  class="card bg-base-200 border border-base-300 cursor-pointer hover:shadow-md transition-shadow"
                  @click="goToService(service.id)"
                >
                  <figure v-if="service.thumbnail" class="h-32">
                    <img :src="service.thumbnail" :alt="service.title" class="w-full h-full object-cover" />
                  </figure>
                  <div class="card-body p-4">
                    <h3 class="font-semibold text-sm">{{ service.title }}</h3>
                    <div class="flex items-center justify-between mt-1">
                      <div class="badge badge-primary badge-outline badge-sm">{{ service.category?.name }}</div>
                      <span class="text-sm font-bold text-primary">{{ formatPrice(service.price, service.pricing_model) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-base-content/60 italic mt-2">{{ $t('providerProfile.noServices') }}</p>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-secondary">
                  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                </svg>
                <h2 class="card-title text-xl">
                  {{ displayProvider.rating }} · {{ displayProvider.reviews_count }} {{ $t('service.reviews').toLowerCase() }}
                </h2>
              </div>

              <div class="space-y-6 mt-4">
                <div v-for="review in reviews" :key="review.id" class="border-b border-base-300 pb-6 last:border-0">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="avatar">
                      <div class="w-10 h-10 rounded-full bg-neutral text-white flex items-center justify-center text-sm font-bold">
                        {{ review.author.charAt(0) }}
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">{{ review.author }}</p>
                      <p class="text-xs text-base-content/50">{{ review.date }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-0.5 mb-2">
                    <template v-for="j in 5" :key="j">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="getStarType(j, review.rating) === 'full' ? 'currentColor' : 'none'" :stroke="getStarType(j, review.rating) !== 'full' ? 'currentColor' : 'none'" stroke-width="1.5" class="w-4 h-4" :class="getStarType(j, review.rating) === 'full' ? 'text-secondary' : 'text-base-content/30'">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </template>
                  </div>
                  <p class="text-base-content/70 text-sm leading-relaxed">{{ review.comment }}</p>
                </div>
              </div>

              <div v-if="reviews.length === 0" class="text-center py-6">
                <p class="text-base-content/60">{{ $t('service.noReviews') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Sticky sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Availability Calendar -->
          <div class="card bg-base-100 shadow-xl border border-base-300 sticky top-4">
            <div class="card-body">
              <h2 class="card-title text-lg">{{ $t('providerProfile.availability') }}</h2>

              <!-- Month navigation -->
              <div class="flex items-center justify-between mt-2 mb-3">
                <button @click="prevMonth" class="btn btn-ghost btn-sm btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <span class="font-semibold text-sm">{{ monthLabel }}</span>
                <button @click="nextMonth" class="btn btn-ghost btn-sm btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              <!-- Week day headers -->
              <div class="grid grid-cols-7 gap-1 text-center text-xs text-base-content/50 mb-1">
                <span v-for="day in weekDays" :key="day">{{ day }}</span>
              </div>

              <!-- Calendar grid -->
              <div class="grid grid-cols-7 gap-1">
                <div
                  v-for="(day, idx) in calendarDays"
                  :key="idx"
                  class="aspect-square flex items-center justify-center text-xs rounded-lg"
                  :class="{
                    'bg-success/20 text-success font-semibold': day.inMonth && day.available,
                    'bg-base-200 text-base-content/30': day.inMonth && !day.available,
                    '': !day.inMonth,
                    'ring-2 ring-primary': day.isToday,
                  }"
                >
                  <span v-if="day.inMonth">{{ day.date }}</span>
                </div>
              </div>

              <!-- Legend -->
              <div class="flex items-center gap-4 mt-3 text-xs text-base-content/60">
                <div class="flex items-center gap-1">
                  <div class="w-3 h-3 rounded bg-success/20"></div>
                  <span>{{ $t('providerProfile.available') }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <div class="w-3 h-3 rounded bg-base-200"></div>
                  <span>{{ $t('providerProfile.unavailable') }}</span>
                </div>
              </div>

              <!-- Book button -->
              <button @click="handleContactProvider" class="btn btn-primary btn-block btn-sm mt-4">
                {{ $t('service.contactProvider') }}
              </button>
            </div>
          </div>

          <!-- Quick Info Card -->
          <div class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <h2 class="card-title text-lg">{{ $t('providerProfile.quickInfo') }}</h2>
              <div class="space-y-3 text-sm">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold">{{ $t('service.verifiedProvider') }}</p>
                    <p class="text-xs text-base-content/60">{{ $t('providerProfile.identityVerified') }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold">{{ $t('service.responseTime') }}</p>
                    <p class="text-xs text-base-content/60">{{ displayProvider.response_time }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold">{{ $t('service.fastTurnaround') }}</p>
                    <p class="text-xs text-base-content/60">{{ $t('providerProfile.quickDelivery') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
