// src/features/subscription/hooks/usePremium.ts
import {
  addCustomerInfoListener,
  configurePurchases,
  getCustomerInfo,
  isPro,
  purchaseDefaultPackage,
  restorePurchases,
  snapshotEntitlements,
} from '@/utils/purchases'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'
import { useSelector } from 'react-redux'
import {
  useCreateCheckoutSessionMutation,
  useGetPremiumFeedQuery,
  useSyncIosIapMutation,
} from '../api/premiumApi'
import type {
  CreateCheckoutSessionResponse,
  PremiumFeedResponse,
} from '../types'

export interface UsePremiumResult {
  premiumFeed?: PremiumFeedResponse
  premiumFeedLoading: boolean
  premiumFeedFetching: boolean
  refetchPremiumFeed: () => void
  initiatePayment: () => Promise<string | null>
  restore: () => Promise<void>
  checkoutData?: CreateCheckoutSessionResponse
  checkoutLoading: boolean
  checkoutError?: unknown
}

export const usePremium = (): UsePremiumResult => {
  const userId = useSelector((s: any) => s.auth?.user?.id)
  const [iosProLocal, setIosProLocal] = useState(false)
  const [syncIosIap] = useSyncIosIapMutation()
  const listenerAddedRef = useRef(false)

  // --- Feed (RTK Query) ---
  const {
    data: premiumFeed,
    isLoading: premiumFeedLoading,
    isFetching: premiumFeedFetching,
    refetch: refetchPremiumFeed,
  } = useGetPremiumFeedQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  })

  // Sync RC -> backend (strict payload)
  const syncIapWithBackend = useCallback(async () => {
    if (Platform.OS !== 'ios') return
    try {
      const info = await getCustomerInfo()
      const snap = snapshotEntitlements(info)
      await syncIosIap({ platform: 'ios', ...snap }).unwrap()
    } catch {
      // swallow; UI still gates optimistically
    }
  }, [syncIosIap])

  // --- Init RevenueCat on iOS ---
  useEffect(() => {
    if (Platform.OS !== 'ios') return
    configurePurchases(userId).catch(() => {})
  }, [userId])

  // --- On first mount (iOS): read current entitlement and set local flag quickly ---
  useEffect(() => {
    if (Platform.OS !== 'ios') return
    ;(async () => {
      try {
        const info = await getCustomerInfo()
        if (isPro(info)) setIosProLocal(true)
      } catch {}
    })()
  }, [])

  // --- Also perform a one-time backend sync on mount (keeps server in lockstep) ---
  useEffect(() => {
    if (Platform.OS !== 'ios') return
    ;(async () => {
      await syncIapWithBackend()
    })()
  }, [syncIapWithBackend])

  // --- Listen for entitlement changes (register once) ---
  useEffect(() => {
    if (Platform.OS !== 'ios') return
    if (listenerAddedRef.current) return

    addCustomerInfoListener(async (info) => {
      if (isPro(info)) {
        setIosProLocal(true)
        await syncIapWithBackend()
        await refetchPremiumFeed()
      }
    })

    listenerAddedRef.current = true
    // No cleanup needed because we only ever add once for app session,
    // and we guard via listenerAddedRef.
     
  }, [syncIapWithBackend, refetchPremiumFeed])

  // --- Android Stripe or iOS RevenueCat purchase ---
  const [
    createCheckoutSession,
    { data: checkoutData, isLoading: checkoutLoading, error: checkoutError },
  ] = useCreateCheckoutSessionMutation()

  const initiatePayment = async (): Promise<string | null> => {
    if (Platform.OS === 'android') {
      const response = await createCheckoutSession().unwrap()
      return response.url
    } else {
      try {
        const info = await purchaseDefaultPackage()
        setIosProLocal(true)
        if (isPro(info)) {
          await syncIapWithBackend()
          Toast.show({ type: 'success', text1: 'Premium unlocked 🎉' })
          await refetchPremiumFeed()
          return null
        }
        throw new Error('Purchase did not activate entitlement')
      } catch (e: any) {
        if (e?.message === 'USER_CANCELLED') return null // no error toast on cancel
        Toast.show({ type: 'error', text1: e?.message ?? 'Purchase failed' })
        throw e
      }
    }
  }

  const restore = async () => {
    if (Platform.OS !== 'ios') return
    try {
      const info = await restorePurchases()
      if (isPro(info)) {
        setIosProLocal(true)
        await syncIapWithBackend()
        Toast.show({ type: 'success', text1: 'Purchases restored' })
        await refetchPremiumFeed()
      } else {
        Toast.show({ type: 'info', text1: 'No purchases to restore' })
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Restore failed' })
    }
  }

  // Sync + refetch whenever Premium screen regains focus
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'ios') syncIapWithBackend() // non-blocking
      refetchPremiumFeed()
    }, [syncIapWithBackend, refetchPremiumFeed])
  )

  return {
    premiumFeed: premiumFeed
      ? {
          ...premiumFeed,
          // Effective flag for iOS while backend hasn’t updated yet
          isPremium:
            premiumFeed.isPremium || (Platform.OS === 'ios' && iosProLocal),
        }
      : premiumFeed,
    premiumFeedLoading,
    premiumFeedFetching,
    refetchPremiumFeed,
    initiatePayment,
    restore,
    checkoutData,
    checkoutLoading,
    checkoutError,
  }
}
