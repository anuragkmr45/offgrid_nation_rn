// app/premium/index.tsx

import { WithLayout } from '@/components/layouts/WithLayout'
import { PremiumFeedError } from '@/components/premium/PremiumFeedError'
import { PremiumFeedLoader } from '@/components/premium/PremiumFeedLoader'
import { PremiumPostWidget } from '@/components/premium/PremiumPostWidget'
import { PremiumSubscribeOverlay } from '@/components/premium/PremiumSubscribeOverlay'
import { theme } from '@/constants/theme'
import { usePremium } from '@/features/subscription/hooks/usePremium'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { FlatList, StatusBar, View } from 'react-native'
import Toast from 'react-native-toast-message'

export default function PremiumScreen() {
  const router = useRouter()
  const {
    premiumFeed,
    premiumFeedLoading,
    refetchPremiumFeed,
    initiatePayment,
    checkoutError,
    checkoutLoading,
  } = usePremium()

  // Show checkout errors
  useEffect(() => {
    if (checkoutError) {
      const {
        data: { error: errorMsg } = { error: 'Something went wrong' },
      } = checkoutError as any

      Toast.show({ type: "error", text1: errorMsg })
    }
  }, [checkoutError])
console.log(premiumFeed);

  // Loading state
  if (premiumFeedLoading) {
    return <PremiumFeedLoader />
  }

  // Not subscribed yet?
  if (!premiumFeed?.isPremium) {
    return (
      <WithLayout>
        <PremiumSubscribeOverlay
          onPayTap={async () => {
            const url = await initiatePayment()
            console.log("in index page ", { url });

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
      <WithLayout headerBgColor={theme.colors.primary}>
        <StatusBar backgroundColor={theme.colors.primary} animated barStyle={'light-content'} />
        <View style={{ backgroundColor: theme.colors.primary , flex: 1 }}>
          <FlatList
            data={premiumFeed?.posts}
            keyExtractor={(post) => post._id}
            contentContainerStyle={{ padding: 12 }}
            renderItem={({ item }) => (
              <PremiumPostWidget
                post={item}
                onLikeTap={() => {/* TODO: call like mutation */ }}
                onCommentTap={() => {/* TODO: open comments */ }}
                onShareTap={() => {/* TODO: share post */ }}
                onProfileTap={() => {/* TODO: navigate to profile */ }}
              />
            )}
            onRefresh={refetchPremiumFeed}
            refreshing={premiumFeedLoading}
          />
        </View>
      </WithLayout>
    )
  }

  // Fallback error / empty state
  return <WithLayout headerBgColor={theme.colors.primary}><PremiumFeedError message="No premium content available." /></WithLayout>
}
