import { theme } from '@/constants/theme'
import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

export const PremiumFeedLoader: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
})
