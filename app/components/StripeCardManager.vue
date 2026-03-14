<script setup lang="ts">
import type { Stripe, StripeElements, StripeCardElementOptions } from '@stripe/stripe-js'

interface PaymentMethod {
  id: string
  card: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
}

const { t } = useI18n()
const { getStripe } = useStripe()
const api = useApi()
const auth = useAuthStore()

const loading = ref(true)
const saving = ref(false)
const showAddCard = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const cardReady = ref(false)
const paymentMethods = ref<PaymentMethod[]>([])

let stripe: Stripe | null = null
let elements: StripeElements | null = null

const cardBrandIcons: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
  diners: '💳',
  jcb: '💳',
  unionpay: '💳',
}

const getCardBrandLabel = (brand: string) => {
  return brand.charAt(0).toUpperCase() + brand.slice(1)
}

const fetchCards = async () => {
  if (!auth.token) return

  loading.value = true
  try {
    const response = await api.fetchPaymentMethods(auth.token)
    paymentMethods.value = response.data || []
  } catch {
    paymentMethods.value = []
  } finally {
    loading.value = false
  }
}

const openAddCard = async () => {
  showAddCard.value = true
  errorMessage.value = ''
  successMessage.value = ''
  cardReady.value = false

  await nextTick()

  try {
    stripe = await getStripe()
    if (!stripe) {
      errorMessage.value = t('stripe.initError')
      return
    }

    elements = stripe.elements()

    const cardElementOptions: StripeCardElementOptions = {
      style: {
        base: {
          fontSize: '16px',
          color: '#374151',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          '::placeholder': {
            color: '#9ca3af',
          },
        },
        invalid: {
          color: '#ef4444',
          iconColor: '#ef4444',
        },
      },
    }

    const cardElement = elements.create('card', cardElementOptions)
    cardElement.mount('#card-element')

    cardElement.on('ready', () => {
      cardReady.value = true
    })

    cardElement.on('change', (event) => {
      if (event.error) {
        errorMessage.value = event.error.message
      } else {
        errorMessage.value = ''
      }
    })
  } catch {
    errorMessage.value = t('stripe.initError')
  }
}

const cancelAddCard = () => {
  showAddCard.value = false
  errorMessage.value = ''
  if (elements) {
    const cardElement = elements.getElement('card')
    if (cardElement) {
      cardElement.destroy()
    }
  }
  elements = null
}

const saveCard = async () => {
  if (!stripe || !elements || !auth.token || saving.value) return

  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // 1. Create a Setup Intent on the backend
    const setupResponse = await api.createSetupIntent(auth.token)
    const clientSecret = setupResponse.data.client_secret

    // 2. Confirm the setup with Stripe
    const cardElement = elements.getElement('card')
    if (!cardElement) {
      errorMessage.value = t('stripe.initError')
      return
    }

    const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    })

    if (error) {
      errorMessage.value = error.message || t('stripe.cardSaveFailed')
      return
    }

    if (setupIntent?.status === 'succeeded') {
      successMessage.value = t('stripe.cardSaved')
      cancelAddCard()
      await fetchCards()
    }
  } catch {
    errorMessage.value = t('stripe.cardSaveFailed')
  } finally {
    saving.value = false
  }
}

const deleteCard = async (paymentMethodId: string) => {
  if (!auth.token) return

  try {
    await api.deletePaymentMethod(auth.token, paymentMethodId)
    paymentMethods.value = paymentMethods.value.filter(pm => pm.id !== paymentMethodId)
    successMessage.value = t('stripe.cardDeleted')
  } catch {
    errorMessage.value = t('stripe.cardDeleteFailed')
  }
}

onMounted(() => {
  fetchCards()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-lg">{{ $t('stripe.savedCards') }}</h3>
          <p class="text-xs text-base-content/60">{{ $t('stripe.savedCardsDesc') }}</p>
        </div>
      </div>
      <button
        v-if="!showAddCard"
        class="btn btn-sm btn-primary rounded-lg gap-1"
        @click="openAddCard"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ $t('stripe.addCard') }}
      </button>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="alert alert-success rounded-xl text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ successMessage }}</span>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage && !showAddCard" class="alert alert-error rounded-xl text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-3">
      <div class="animate-pulse flex items-center gap-4 p-4 rounded-xl bg-base-200/50">
        <div class="h-10 w-16 bg-base-300 rounded-lg"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 w-32 bg-base-300 rounded"></div>
          <div class="h-3 w-24 bg-base-300 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Cards list -->
    <div v-else-if="paymentMethods.length > 0" class="space-y-3">
      <div
        v-for="pm in paymentMethods"
        :key="pm.id"
        class="flex items-center justify-between p-4 rounded-xl bg-base-200/50 border border-base-300 hover:border-primary/30 transition-colors"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-8 rounded-md bg-base-300 flex items-center justify-center text-lg">
            {{ cardBrandIcons[pm.card.brand] || '💳' }}
          </div>
          <div>
            <p class="font-medium text-sm">
              {{ getCardBrandLabel(pm.card.brand) }} •••• {{ pm.card.last4 }}
            </p>
            <p class="text-xs text-base-content/50">
              {{ $t('stripe.expires') }} {{ String(pm.card.exp_month).padStart(2, '0') }}/{{ pm.card.exp_year }}
            </p>
          </div>
        </div>
        <button
          class="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-lg"
          @click="deleteCard(pm.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!showAddCard" class="text-center py-8 rounded-xl bg-base-200/30">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-base-content/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      <p class="text-base-content/50 text-sm">{{ $t('stripe.noCards') }}</p>
      <button class="btn btn-sm btn-primary rounded-lg mt-3 gap-1" @click="openAddCard">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ $t('stripe.addFirstCard') }}
      </button>
    </div>

    <!-- Add Card Form -->
    <div v-if="showAddCard" class="p-5 rounded-xl border border-primary/20 bg-base-200/30 space-y-4">
      <h4 class="font-semibold text-sm">{{ $t('stripe.addNewCard') }}</h4>

      <!-- Stripe Card Element mount point -->
      <div class="p-3 rounded-lg bg-base-100 border border-base-300">
        <div id="card-element"></div>
      </div>

      <!-- Inline error for card input -->
      <div v-if="errorMessage" class="text-error text-xs flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ errorMessage }}
      </div>

      <div class="flex gap-2 justify-end">
        <button
          class="btn btn-ghost btn-sm rounded-lg"
          :disabled="saving"
          @click="cancelAddCard"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          class="btn btn-primary btn-sm rounded-lg gap-1"
          :disabled="!cardReady || saving"
          @click="saveCard"
        >
          <span v-if="saving" class="loading loading-spinner loading-xs"></span>
          {{ saving ? $t('stripe.saving') : $t('stripe.saveCard') }}
        </button>
      </div>

      <p class="text-xs text-base-content/50 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        {{ $t('stripe.securedByStripe') }}
      </p>
    </div>
  </div>
</template>
