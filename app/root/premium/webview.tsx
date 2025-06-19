// app/premium/webview.tsx

import { theme } from '@/constants/theme'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useRef } from 'react'
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

export default function PremiumWebView() {
  const webviewRef = useRef<WebView>(null)
  const router = useRouter()
  const params = useLocalSearchParams<{ url: string | string[] }>()
  let { url } = params

  if (!url) {
    return null
  }

  // if an array was passed, just take the first one
  if (Array.isArray(url)) {
    url = url[0]
  }

  console.log('Loading checkout URL:', url)

  const handleNavStateChange = (navState: any) => {
    const nextUrl = navState.url as string
    if (nextUrl.includes('/root/premium/success')) {
      router.replace('root/premium/success')
    } else if (nextUrl.includes('/root/premium/failure')) {
      router.replace('/root/premium/failure')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.background} animated barStyle={'dark-content'} />
      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        style={styles.webview}
        onNavigationStateChange={handleNavStateChange}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // make container fill the screen
  },
  webview: {
    flex: 1,                  // make webview fill its parent
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
