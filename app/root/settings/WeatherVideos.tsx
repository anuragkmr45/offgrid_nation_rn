// app/root/settings/WeatherVideos.tsx

import Header from '@/components/common/Header'
import { theme } from '@/constants/theme'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, StatusBar, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

export default function WeatherVideos() {
  const router = useRouter()
  return (
    <>
      <StatusBar animated backgroundColor={theme.colors.background} barStyle={'dark-content'} />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Header
          onBack={() => router.back()}
          backgroundColor={theme.colors.background}
          title="Weather Reports"
          iconColor={theme.colors.textPrimary}
        />
        <WebView
          source={{ uri: 'https://www.youtube.com/@weathermanplus/videos' }}
          javaScriptEnabled={true}           // allow JS execution
          domStorageEnabled={true}           // allow localStorage, cookies
          startInLoadingState={true}         // show loader until page ready
          renderLoading={() => (
            <ActivityIndicator
              style={styles.loader}
              size="large"
            />
          )}
        />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center' },
})
