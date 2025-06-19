// src/features/subscription/hooks/usePremium.ts
import {
  useCreateCheckoutSessionMutation,
  useGetPremiumFeedQuery,
} from '../api/premiumApi'
import type {
  CreateCheckoutSessionResponse,
  PremiumFeedResponse,
} from '../types'

export interface UsePremiumResult {
  premiumFeed?: PremiumFeedResponse
  premiumFeedLoading: boolean
  refetchPremiumFeed: () => void
  initiatePayment: () => Promise<string>
  checkoutData?: CreateCheckoutSessionResponse
  checkoutLoading: boolean
  checkoutError?: unknown
}

export const usePremium = (): UsePremiumResult => {
  const {
    data: premiumFeed,
    isLoading: premiumFeedLoading,
    refetch: refetchPremiumFeed,
  } = useGetPremiumFeedQuery()

  const [
    createCheckoutSession,
    { data: checkoutData, isLoading: checkoutLoading, error: checkoutError },
  ] = useCreateCheckoutSessionMutation()

  const initiatePayment = async (): Promise<string> => {
    const response = await createCheckoutSession().unwrap()
    return response.url
  }

  return {
    premiumFeed,
    premiumFeedLoading,
    refetchPremiumFeed,
    initiatePayment,
    checkoutData,
    checkoutLoading,
    checkoutError,
  }
}
