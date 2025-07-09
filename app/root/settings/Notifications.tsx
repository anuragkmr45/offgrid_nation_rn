import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import { NotificationScreen } from '@/components/notification/NotificationScreen'
import { theme } from '@/constants/theme'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SettingsRoute() {
  return <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.primary }}>
    <StatusBar
      backgroundColor={theme.colors.primary}
      barStyle="light-content"
      animated
    />
    <ProtectedLayout>
      <NotificationScreen />
    </ProtectedLayout>
  </SafeAreaView>
}
