// app/premium/index.tsx

import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import { WithLayout } from '@/components/layouts/WithLayout'
import { PremiumFeedError } from '@/components/premium/PremiumFeedError'
import { PremiumFeedLoader } from '@/components/premium/PremiumFeedLoader'
import { PremiumPostWidget } from '@/components/premium/PremiumPostWidget'
import { PremiumSubscribeOverlay } from '@/components/premium/PremiumSubscribeOverlay'
import { theme } from '@/constants/theme'
import { usePremium } from '@/features/subscription/hooks/usePremium'
import { TAB_EVENTS, TabEventEmitter } from '@/utils/TabEventEmitter'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef } from 'react'
import { FlatList, Platform, StatusBar, View } from 'react-native'
import Toast from 'react-native-toast-message'

export default function PremiumScreen() {
  const router = useRouter()
  const {
    premiumFeed,
    premiumFeedLoading,      // initial mount
    premiumFeedFetching,     // any in-flight refetch
    refetchPremiumFeed,
    initiatePayment,
    checkoutError,
    checkoutLoading,
  } = usePremium();

  const flatListRef = useRef<FlatList>(null)

// inside PremiumScreen component:
const handlePayTap = async () => {
  try {
    const url = await initiatePayment();        // Android returns URL; iOS returns null or throws
    if (Platform.OS === 'android') {
      if (!url) throw new Error('Checkout unavailable');
      router.push({
        pathname: '/root/premium/webview',
        params: { url: encodeURIComponent(url) }, // encode in case of query chars
      });
    } else {
      // iOS flow is native via RevenueCat; initiatePayment already refetches on success.
      await refetchPremiumFeed();
    }
  } catch (e: any) {
    // Swallow "USER_CANCELLED" as a benign path
    const msg = e?.message?.toString?.() ?? '';
    if (msg.toUpperCase().includes('USER_CANCELLED')) return;
    Toast.show({ type: 'error', text1: msg || 'Unable to start checkout' });
  }
};


  useEffect(() => {
    const listener = () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
      setTimeout(() => {
        refetchPremiumFeed()
      }, 500)
    }

    TabEventEmitter.on(TAB_EVENTS.PREMIUM_DOUBLE_TAP, listener) // ✅ NEW
    return () => {
      TabEventEmitter.off(TAB_EVENTS.PREMIUM_DOUBLE_TAP, listener) // ✅ NEW
    }
  }, [refetchPremiumFeed])

  useFocusEffect(
    useCallback(() => {
      refetchPremiumFeed();
    }, [refetchPremiumFeed])
  );

  // Show checkout errors
  useEffect(() => {
    if (checkoutError) {
      const {
        data: { error: errorMsg } = { error: 'Something went wrong' },
      } = checkoutError as any

      Toast.show({ type: "error", text1: errorMsg })
    }
  }, [checkoutError])

  if (premiumFeedLoading || premiumFeedFetching) {
    return (
      <WithLayout>
        <PremiumFeedLoader />
      </WithLayout>
    );
  }

  // Not subscribed yet?
  if (premiumFeed?.isPremium === false) {
    return (
      <WithLayout>
        <ProtectedLayout>
          <PremiumSubscribeOverlay
            onPayTap={handlePayTap}
            isLoading={checkoutLoading}
          />
        </ProtectedLayout>
      </WithLayout>
    )
  }

  // Subscribed and have posts
  if (premiumFeed?.posts) {
    return (
      <WithLayout headerBgColor={"#Fbbc06"}>
        <StatusBar backgroundColor={"#Fbbc06"} animated barStyle="dark-content" />
        <ProtectedLayout>
          <View style={{ backgroundColor: "#Fbbc06", flex: 1, paddingBottom: 30 }}>
            <FlatList
              data={premiumFeed.posts}
              ref={flatListRef}
              keyExtractor={(post) => post._id}
              contentContainerStyle={{ padding: 12 }}
              refreshing={premiumFeedLoading}
              onRefresh={refetchPremiumFeed}
              renderItem={({ item }) => (
                <PremiumPostWidget
                  post={item}
                  onProfileTap={() => {
                    // TODO: navigate to user's profile
                  }}
                />
              )}
            />
          </View>
        </ProtectedLayout>
      </WithLayout>
    )
  }

  return <WithLayout headerBgColor={theme.colors.primary}><ProtectedLayout><PremiumFeedError message="No premium content available." /></ProtectedLayout></WithLayout>
}
