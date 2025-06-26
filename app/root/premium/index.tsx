// app/premium/index.tsx

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
import { FlatList, StatusBar, View } from 'react-native'
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
    }, [])
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

  // Loading state
  if (premiumFeedLoading) {
    return <WithLayout><PremiumFeedLoader /></WithLayout>
  }

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
        <PremiumSubscribeOverlay
          onPayTap={async () => {
            const url = await initiatePayment()

            router.push({ pathname: '/root/premium/webview', params: { url } })
          }}
          isLoading={checkoutLoading}
        />
      </WithLayout>
    )
  }

  // Subscribed and have posts
  if (premiumFeed?.posts) {
    return (
      <WithLayout headerBgColor={"#Fbbc06"}>
        <StatusBar backgroundColor={"#Fbbc06"} animated barStyle="dark-content" />
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
      </WithLayout>
    )
  }

  return <WithLayout headerBgColor={theme.colors.primary}><PremiumFeedError message="No premium content available." /></WithLayout>
}
