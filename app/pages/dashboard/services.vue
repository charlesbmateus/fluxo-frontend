<script setup lang="ts">
import { useServicesStore } from '~/stores/services'

const { user } = useAuth()
const { t } = useI18n()
const servicesStore = useServicesStore()

const loading = ref(true)
const togglingId = ref<number | null>(null)
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  if (user.value?.id) {
    loading.value = true
    await servicesStore.fetchProviderServices(user.value.id)
    loading.value = false
  }
})

const toggleActive = async (serviceId: number) => {
  togglingId.value = serviceId
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await servicesStore.toggleServiceActive(serviceId)

    if (servicesStore.error) {
      errorMessage.value = t('providerServices.toggleError')
    } else {
      successMessage.value = t('providerServices.toggleSuccess')
    }
  } catch {
    errorMessage.value = t('providerServices.toggleError')
  } finally {
    togglingId.value = null
    setTimeout(() => {
      successMessage.value = ''
      errorMessage.value = ''
    }, 3000)
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-base-content">{{ t('providerServices.title') }}</h1>
        <p class="text-base-content/60 mt-1">{{ t('providerServices.subtitle') }}</p>
      </div>

      <!-- Success/Error Alerts -->
      <div v-if="successMessage" class="alert alert-success shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ successMessage }}</span>
      </div>

      <div v-if="errorMessage" class="alert alert-error shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Loading State -->
      <template v-if="loading">
        <div class="space-y-4">
          <SkeletonsServiceItemSkeleton v-for="i in 4" :key="i" />
        </div>
      </template>

      <!-- Empty State -->
      <div v-else-if="servicesStore.providerServices.length === 0" class="card bg-base-100 shadow-xl border border-base-300">
        <div class="card-body items-center text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p class="text-base-content/60 text-lg">{{ t('providerServices.noServices') }}</p>
        </div>
      </div>

      <!-- Services List -->
      <div v-else class="space-y-4">
        <div
          v-for="service in servicesStore.providerServices"
          :key="service.id"
          class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300"
        >
          <div class="card-body">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <!-- Service Info -->
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <div class="avatar">
                  <div class="w-16 h-16 rounded-xl">
                    <img
                      v-if="service.thumbnail"
                      :src="service.thumbnail"
                      :alt="service.title"
                      class="object-cover"
                    />
                    <div v-else class="w-full h-full bg-base-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="min-w-0">
                  <h3 class="font-semibold text-lg text-base-content truncate">{{ service.title }}</h3>
                  <div class="flex flex-wrap items-center gap-2 mt-1">
                    <span class="badge badge-outline badge-sm">{{ service.category?.name }}</span>
                    <span class="text-sm text-base-content/60">
                      {{ service.pricing_model === 'hourly' ? `$${service.price}/hr` : `$${service.price}` }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Toggle -->
              <div class="flex items-center gap-3">
                <span
                  class="text-sm font-medium"
                  :class="service.is_active ? 'text-success' : 'text-base-content/40'"
                >
                  {{ service.is_active ? t('providerServices.active') : t('providerServices.inactive') }}
                </span>
                <input
                  type="checkbox"
                  class="toggle toggle-success"
                  :checked="service.is_active"
                  :disabled="togglingId === service.id"
                  @change="toggleActive(service.id)"
                />
                <span
                  v-if="togglingId === service.id"
                  class="loading loading-spinner loading-sm"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
