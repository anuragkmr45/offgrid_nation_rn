import { theme } from '@/constants/theme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export interface PremiumFeedErrorProps {
  message: string
}

export const PremiumFeedError: React.FC<PremiumFeedErrorProps> = ({
  message,
}) => (
  <View style={styles.container}>
    <Text style={styles.text}>
      {message || "Something went wrong." }
    </Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    padding: 16,
  },
  text: {
    color: 'red',
    textAlign: 'center',
    fontSize: theme.fontSizes.bodyLarge,
  },
})
