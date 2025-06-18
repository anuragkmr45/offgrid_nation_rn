import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { useAppSelector } from '../store/hooks';

export default function SplashScreen() {
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) {
        router.replace('/')
      } else {
        router.replace('/auth/login/Login')
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [user])

  return (
    <View>
      <Image
        source={require('../assets/images/splash-icon.png')}
      />
      <Text>splash screne splash screne splash screne splash screne splash screne splash screne splash screne splash screne splash screne splash screne splash screne </Text>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  )
}
