<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="default">
    <div class="max-w-xl mx-auto py-16 text-center">
      <!-- Cancel Icon -->
      <div class="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10 text-warning">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>

      <h1 class="text-3xl font-bold mb-3">{{ t('checkout.cancelTitle') }}</h1>
      <p class="text-base-content/60 mb-8">{{ t('checkout.cancelMessage') }}</p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="router.push('/marketplace')" class="btn btn-primary">
          {{ t('checkout.backToMarketplace') }}
        </button>
        <button @click="router.push('/dashboard')" class="btn btn-outline">
          {{ t('checkout.viewBookings') }}
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>
