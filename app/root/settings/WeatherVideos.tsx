// app/root/settings/WeatherVideos.tsx

import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

export default function WeatherVideos() {
  return (
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
  )
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center' },
})
