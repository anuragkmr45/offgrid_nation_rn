import { theme } from '@/constants/theme'
import { BlurView } from 'expo-blur'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { PremiumContentCard } from './PremiumContentCard'

export interface PremiumSubscribeOverlayProps {
  onPayTap: () => void
  isLoading: boolean
}

export const PremiumSubscribeOverlay: React.FC<PremiumSubscribeOverlayProps> = ({
  onPayTap,
  isLoading,
}) => (
  <View style={styles.container}>
    <BlurView style={StyleSheet.absoluteFill} intensity={50} tint="dark" />
    <View style={styles.content}>
      <PremiumContentCard onPayTap={onPayTap} isLoading={isLoading} />
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
})
