import { Button } from '@/components/common'
import { theme } from '@/constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export interface PremiumContentCardProps {
  onPayTap: () => void
  isLoading: boolean
}

export const PremiumContentCard: React.FC<PremiumContentCardProps> = ({
  onPayTap,
  isLoading,
}) => (
  <LinearGradient
    colors={['#FE8235', '#F93B63']}
    start={{ x: 0.5, y: 0 }}
    end={{ x: 0.5, y: 1 }}
    style={styles.card}
  >
    <Text style={styles.title}>Welcome to{'\n'}Offgrid Premium</Text>
    <Text style={styles.subtitle}>Unlock Premium Access! 🚀</Text>

    <View style={styles.feature}>
      <Text style={styles.featureEmoji}>✅</Text>
      <Text style={styles.featureText}>
        Exclusive Content – Get special access to premium insights.
      </Text>
    </View>

    <View style={styles.feature}>
      <Text style={styles.featureEmoji}>✅</Text>
      <Text style={styles.featureText}>
        Regular Updates – Fresh content added by the admin.
      </Text>
    </View>

    <View style={styles.feature}>
      <Text style={styles.featureEmoji}>✅</Text>
      <Text style={styles.featureText}>
        Instant Alerts – Get notified when new premium content drops!
      </Text>
    </View>

    <Text style={styles.callout}>
      Subscribe now & elevate your experience! ✨
    </Text>

    <Button
      text={isLoading ? 'Processing...' : 'Pay'}
      onPress={onPayTap}
      loading={isLoading}
      style={styles.button}
      textColor={theme.colors.textPrimary}
    />
  </LinearGradient>
)

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    padding: 24,
    width: '100%',
  },
  title: {
    color: 'white',
    fontSize: theme.fontSizes.displaySmall,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: 'white',
    fontSize: theme.fontSizes.titleLarge,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  featureEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  featureText: {
    flex: 1,
    color: 'white',
    lineHeight: 20,
  },
  callout: {
    color: 'white',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: theme.colors.background,
  },
})
