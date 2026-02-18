<script setup lang="ts">
import { useServicesStore } from '~/stores/services'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()
const { t } = useI18n()

const store = useServicesStore()
const { loading } = storeToRefs(store)

const showGalleryModal = ref(false)
const galleryIndex = ref(0)

const service = computed(() => {
  const id = Number(route.params.id)
  return store.getById(id)
})

// Build gallery images from the service data
const galleryImages = computed(() => {
  if (!service.value) return []
  // Use images array if available, otherwise create gallery from thumbnail
  if (service.value.images && service.value.images.length > 0) {
    return service.value.images.map(img => img.url)
  }
  // Fallback: use thumbnail repeated for demo grid
  const thumb = service.value.thumbnail
  return thumb ? [thumb, thumb, thumb, thumb, thumb] : []
})

// Service rating (from API or default placeholder)
const serviceRating = computed(() => service.value?.rating ?? 4.8)
const reviewsCount = computed(() => service.value?.reviews_count ?? 24)
const yearsExperience = computed(() => service.value?.years_experience ?? 5)
const responseTime = computed(() => service.value?.response_time ?? '< 1h')

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

// Placeholder reviews when API doesn't provide them
const reviews = computed(() => {
  if (service.value?.reviews && service.value.reviews.length > 0) {
    return service.value.reviews
  }
  return [
    { id: 1, author: 'Sophie M.', avatar: null, rating: 5, comment: 'Excellent service! Very professional and delivered on time. I highly recommend this provider.', date: '2026-01-15' },
    { id: 2, author: 'Luca B.', avatar: null, rating: 5, comment: 'Great quality work. Communication was clear and the result exceeded expectations.', date: '2026-01-08' },
    { id: 3, author: 'Marie K.', avatar: null, rating: 4, comment: 'Very good experience overall. Would definitely use again for future projects.', date: '2025-12-22' },
  ]
})

const openGallery = (index: number) => {
  galleryIndex.value = index
  showGalleryModal.value = true
}

const closeGallery = () => {
  showGalleryModal.value = false
}

const nextImage = () => {
  galleryIndex.value = (galleryIndex.value + 1) % galleryImages.value.length
}

const prevImage = () => {
  galleryIndex.value = (galleryIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}

const handleBookService = () => {
  if (!isAuthenticated.value) {
    router.push(`/login?redirect=/book/${route.params.id}`)
    return
  }
  router.push(`/book/${route.params.id}`)
}

const handleContactProvider = () => {
  if (!isAuthenticated.value) {
    router.push(`/login?redirect=${route.fullPath}`)
    return
  }
  router.push('/messages')
}

// Star rendering helper
const getStarType = (starIndex: number, rating: number): 'full' | 'half' | 'empty' => {
  if (starIndex <= Math.floor(rating)) return 'full'
  if (starIndex === Math.ceil(rating) && rating % 1 >= 0.5) return 'half'
  return 'empty'
}

onMounted(async () => {
  if (store.items.length === 0) {
    await store.fetchServices()
  }
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="space-y-6" v-if="service">
      <!-- Header: Title, rating, location, actions -->
      <div>
        <button @click="router.back()" class="btn btn-ghost btn-sm mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 class="text-2xl md:text-3xl font-bold">{{ service.title }}</h1>
        <div class="flex flex-wrap items-center gap-2 mt-2 text-sm">
          <!-- Rating -->
          <div class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-secondary">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
            </svg>
            <span class="font-semibold">{{ serviceRating }}</span>
            <span class="text-base-content/60">({{ reviewsCount }} {{ $t('service.reviews').toLowerCase() }})</span>
          </div>
          <span class="text-base-content/40">·</span>
          <div class="badge badge-primary badge-sm">{{ service.category?.name }}</div>
          <span class="text-base-content/40">·</span>
          <!-- Location -->
          <div class="flex items-center gap-1 text-base-content/70">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{{ service.city }}, {{ service.country }}</span>
          </div>
          <!-- Share & Save -->
          <div class="ml-auto flex items-center gap-2">
            <button class="btn btn-ghost btn-sm gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              <span class="hidden sm:inline">{{ $t('service.shareService') }}</span>
            </button>
            <button class="btn btn-ghost btn-sm gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span class="hidden sm:inline">{{ $t('service.saveService') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Airbnb-style Image Gallery Grid -->
      <div v-if="galleryImages.length > 0" class="relative rounded-xl overflow-hidden cursor-pointer" @click="openGallery(0)">
        <div class="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[300px] md:h-[400px]">
          <!-- Main large image -->
          <div class="md:col-span-2 md:row-span-2 relative">
            <img
              :src="galleryImages[0]"
              :alt="service.title"
              class="w-full h-full object-cover hover:opacity-90 transition-opacity"
            />
          </div>
          <!-- Secondary images -->
          <div v-for="(img, idx) in galleryImages.slice(1, 5)" :key="idx" class="hidden md:block relative" @click.stop="openGallery(idx + 1)">
            <img
              :src="img"
              :alt="`${service.title} ${idx + 2}`"
              class="w-full h-full object-cover hover:opacity-90 transition-opacity"
            />
          </div>
        </div>
        <!-- Show all photos button -->
        <button
          v-if="galleryImages.length > 1"
          class="absolute bottom-4 right-4 btn btn-sm bg-white text-black border-black hover:bg-gray-100"
          @click.stop="openGallery(0)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          {{ $t('service.showAllPhotos') }}
        </button>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Details -->
        <div class="lg:col-span-2 space-y-8">

          <!-- Provider quick info (Airbnb host-style) -->
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold">
                {{ $t('service.provider') }}: {{ service.provider?.name }}
              </h2>
              <div class="flex flex-wrap items-center gap-3 mt-1 text-sm text-base-content/60">
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  {{ yearsExperience }} {{ $t('service.yearsExperience') }}
                </span>
                <span class="text-base-content/40">·</span>
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ $t('service.responseTime') }}: {{ responseTime }}
                </span>
              </div>
            </div>
            <div class="avatar">
              <div class="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                {{ service.provider?.name?.charAt(0) }}
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Service highlights with icons -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="flex items-start gap-3">
              <div class="p-2 bg-primary/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-sm">{{ $t('service.verifiedProvider') }}</p>
                <p class="text-xs text-base-content/60">{{ $t('service.highQuality') }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="p-2 bg-primary/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-sm">{{ $t('service.topRated') }}</p>
                <p class="text-xs text-base-content/60">{{ serviceRating }}/5 ({{ reviewsCount }})</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="p-2 bg-primary/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-sm">{{ $t('service.fastTurnaround') }}</p>
                <p class="text-xs text-base-content/60">{{ $t('service.responseTime') }}: {{ responseTime }}</p>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Description -->
          <div>
            <h2 class="text-xl font-semibold mb-3">{{ $t('service.description') }}</h2>
            <p class="text-base-content/80 leading-relaxed whitespace-pre-line">{{ service.description }}</p>
          </div>

          <div class="divider"></div>

          <!-- What's included (with icons) -->
          <div>
            <h2 class="text-xl font-semibold mb-4">{{ $t('service.whatsIncluded') }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-success flex-shrink-0">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="text-base-content/80">{{ $t('service.professionalService') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-success flex-shrink-0">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="text-base-content/80">{{ $t('service.highQuality') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-success flex-shrink-0">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="text-base-content/80">{{ $t('service.customerSupport') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-success flex-shrink-0">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="text-base-content/80">{{ $t('service.revisionIncluded') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-success flex-shrink-0">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="text-base-content/80">{{ $t('service.fastTurnaround') }}</span>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- About the provider -->
          <div>
            <h2 class="text-xl font-semibold mb-4">{{ $t('service.aboutProvider') }}</h2>
            <div class="card bg-base-200 border border-base-300">
              <div class="card-body">
                <div class="flex items-start gap-4">
                  <div class="avatar">
                    <div class="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                      {{ service.provider?.name?.charAt(0) }}
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-lg">{{ service.provider?.name }}</h3>
                    <div class="flex flex-wrap items-center gap-3 mt-1">
                      <div class="badge badge-outline badge-sm">{{ $t('service.superProvider') }}</div>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <p class="font-bold">{{ reviewsCount }}</p>
                        <p class="text-base-content/60">{{ $t('service.reviews') }}</p>
                      </div>
                      <div>
                        <div class="flex items-center gap-1">
                          <p class="font-bold">{{ serviceRating }}</p>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-secondary">
                            <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                          </svg>
                        </div>
                        <p class="text-base-content/60">{{ $t('service.rating') }}</p>
                      </div>
                      <div>
                        <p class="font-bold">{{ yearsExperience }}</p>
                        <p class="text-base-content/60">{{ $t('service.yearsExperience') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Reviews Section -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-secondary">
                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
              </svg>
              <h2 class="text-xl font-semibold">{{ serviceRating }} · {{ reviewsCount }} {{ $t('service.reviews').toLowerCase() }}</h2>
            </div>

            <div class="space-y-6">
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
          </div>
        </div>

        <!-- Right Column: Sticky Booking Card -->
        <div class="lg:col-span-1">
          <div class="card bg-base-100 shadow-xl border border-base-300 sticky top-4">
            <div class="card-body">
              <!-- Price -->
              <div class="flex items-baseline gap-1 mb-2">
                <span class="text-2xl font-bold">{{ formattedPrice }}</span>
                <span class="text-base-content/60 text-sm">{{ pricingLabel }}</span>
              </div>

              <div class="divider my-2"></div>

              <!-- Service summary -->
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-base-content/70">{{ $t('service.price') }}</span>
                  <span>{{ formattedPrice }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/70">{{ $t('service.location') }}</span>
                  <span>{{ service.city }}, {{ service.country }}</span>
                </div>
              </div>

              <div class="divider my-2"></div>

              <!-- Total -->
              <div class="flex justify-between items-center font-bold text-lg">
                <span>{{ $t('service.totalPrice') }}</span>
                <span>{{ formattedPrice }}</span>
              </div>

              <!-- Booking buttons -->
              <button @click="handleBookService" class="btn btn-primary btn-block btn-lg mt-4">
                {{ $t('service.bookNow') }}
              </button>
              <button @click="handleContactProvider" class="btn btn-outline btn-block mt-2">
                {{ $t('service.contactProvider') }}
              </button>

              <p class="text-center text-xs text-base-content/50 mt-3">
                {{ $t('service.customerSupport') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Gallery Modal -->
    <Teleport to="body">
      <div v-if="showGalleryModal" class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" @click="closeGallery">
        <!-- Close button -->
        <button class="absolute top-4 left-4 btn btn-circle btn-ghost text-white" @click="closeGallery">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Counter -->
        <div class="absolute top-4 right-4 text-white text-sm">
          {{ galleryIndex + 1 }} / {{ galleryImages.length }}
        </div>

        <!-- Previous button -->
        <button class="absolute left-4 btn btn-circle btn-ghost text-white" @click.stop="prevImage">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <!-- Image -->
        <img :src="galleryImages[galleryIndex]" :alt="`${service?.title} ${galleryIndex + 1}`" class="max-h-[85vh] max-w-[90vw] object-contain" @click.stop />

        <!-- Next button -->
        <button class="absolute right-4 btn btn-circle btn-ghost text-white" @click.stop="nextImage">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </Teleport>

    <!-- Loading State -->
    <div v-if="!service" class="flex justify-center items-center min-h-screen">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  </NuxtLayout>
</template>
