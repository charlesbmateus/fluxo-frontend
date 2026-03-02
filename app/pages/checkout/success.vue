<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const sessionId = computed(() => route.query.session_id as string || '')
</script>

<template>
  <NuxtLayout name="default">
    <div class="max-w-xl mx-auto py-16 text-center">
      <!-- Success Icon -->
      <div class="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10 text-success">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 class="text-3xl font-bold mb-3">{{ t('checkout.successTitle') }}</h1>
      <p class="text-base-content/60 mb-8">{{ t('checkout.successMessage') }}</p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="router.push('/dashboard')" class="btn btn-primary">
          {{ t('checkout.viewBookings') }}
        </button>
        <button @click="router.push('/marketplace')" class="btn btn-outline">
          {{ t('checkout.browseMore') }}
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>
