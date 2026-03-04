import { loadStripe } from '@stripe/stripe-js'
import type { Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

export const useStripe = () => {
  const config = useRuntimeConfig()

  const getStripe = () => {
    if (!stripePromise) {
      const key = config.public.stripeKey as string
      if (!key) {
        console.warn('[Stripe] Missing publishable key. Set NUXT_PUBLIC_STRIPE_KEY in your environment.')
        return Promise.resolve(null)
      }
      stripePromise = loadStripe(key)
    }
    return stripePromise
  }

  const redirectToCheckout = async (sessionId: string) => {
    const stripe = await getStripe()
    if (!stripe) {
      throw new Error('Stripe has not been initialized. Check your publishable key.')
    }
    const { error } = await stripe.redirectToCheckout({ sessionId })
    if (error) {
      throw error
    }
  }

  return {
    getStripe,
    redirectToCheckout,
  }
}
