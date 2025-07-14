import { APP_LOGO_WHITE } from '@/constants/AppConstants'
import { theme } from '@/constants/theme'
import { useAppSelector } from '@/store/hooks'
import { persistor } from '@/store/store'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'

export default function SplashScreen() {
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const [rehydrated, setRehydrated] = useState(persistor.getState().bootstrapped)

  useEffect(() => {
    if (!rehydrated) {
      const interval = setInterval(() => {
        const ready = persistor.getState().bootstrapped
        if (ready) {
          setRehydrated(true)
          clearInterval(interval)
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [rehydrated])

  useEffect(() => {
    if (rehydrated) {
      const timeout = setTimeout(() => {
        if (user && user._id) {
          router.replace('/root/feed')
        } else {
          router.replace('/auth/login/Login')
        }
      }, 1800)

      return () => clearTimeout(timeout)
    }
  }, [rehydrated, user])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={theme.colors.primary}
        animated
        hidden
      />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to</Text>
        <Image
          source={{
            uri: APP_LOGO_WHITE
          }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Connect, Explore, and Thrive</Text>

        {!rehydrated && (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{ marginTop: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 260,
    height: 140,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
})
