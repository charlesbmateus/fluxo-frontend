<script setup lang="ts">
import type { Stripe, StripeElements, StripePaymentElementOptions } from '@stripe/stripe-js'

const props = defineProps<{
  clientSecret: string
  returnUrl?: string
}>()

const emit = defineEmits<{
  error: [message: string]
}>()

const { t } = useI18n()
const { getStripe } = useStripe()

const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')
const paymentElementReady = ref(false)

let stripe: Stripe | null = null
let elements: StripeElements | null = null

const mountPaymentElement = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    stripe = await getStripe()
    if (!stripe) {
      errorMessage.value = t('stripe.initError')
      return
    }

    elements = stripe.elements({
      clientSecret: props.clientSecret,
    })

    const paymentElementOptions: StripePaymentElementOptions = {
      layout: 'tabs',
    }

    const paymentElement = elements.create('payment', paymentElementOptions)
    paymentElement.mount('#payment-element')

    paymentElement.on('ready', () => {
      paymentElementReady.value = true
      loading.value = false
    })

    paymentElement.on('change', (event) => {
      if (event.complete) {
        errorMessage.value = ''
      }
    })
  } catch {
    errorMessage.value = t('stripe.initError')
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!stripe || !elements || submitting.value) return

  submitting.value = true
  errorMessage.value = ''

  try {
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: props.returnUrl || `${window.location.origin}/checkout/success`,
      },
    })

    // If we reach here, it means there was an error (successful payments redirect)
    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        errorMessage.value = error.message || t('stripe.paymentFailed')
      } else {
        errorMessage.value = t('stripe.paymentFailed')
      }
      emit('error', errorMessage.value)
    }
  } catch {
    errorMessage.value = t('stripe.paymentFailed')
    emit('error', errorMessage.value)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  mountPaymentElement()
})
</script>

<template>
  <div class="space-y-4">
    <!-- Loading skeleton -->
    <div v-if="loading" class="animate-pulse space-y-3">
      <div class="h-10 bg-base-300 rounded-lg"></div>
      <div class="h-10 bg-base-300 rounded-lg"></div>
      <div class="h-10 bg-base-300 rounded-lg"></div>
    </div>

    <!-- Stripe Payment Element mount point -->
    <div id="payment-element" :class="{ 'min-h-[200px]': !paymentElementReady }"></div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alert alert-error rounded-xl text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Submit button -->
    <button
      class="btn btn-primary rounded-xl h-12 w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-0 shadow-lg shadow-purple-500/30"
      :disabled="!paymentElementReady || submitting"
      @click="handleSubmit"
    >
      <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      {{ submitting ? $t('stripe.processing') : $t('stripe.payNow') }}
    </button>

    <!-- Security note -->
    <p class="text-xs text-base-content/50 text-center flex items-center justify-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      {{ $t('stripe.securedByStripe') }}
    </p>
  </div>
</template>
