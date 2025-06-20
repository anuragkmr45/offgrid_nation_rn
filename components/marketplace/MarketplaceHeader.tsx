// components/marketplace/MarketplaceHeader.tsx

import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export interface MarketplaceHeaderProps {
  /** Screen title (defaults to “Marketplace”) */
  title?: string
  /** Background color for the header */
  backgroundColor?: string
  /** Called when back arrow is tapped */
  onBack: () => void
  /** Called when profile icon is tapped */
  onProfilePress?: () => void
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  title = 'Marketplace',
  backgroundColor = theme.colors.background,
  onBack,
  onProfilePress,
}) => (
  <View style={[styles.container, { backgroundColor }]}>
    {/* Back arrow */}
    <TouchableOpacity onPress={onBack} style={styles.iconButton}>
      <Ionicons
        name="arrow-back"
        size={24}
        color={theme.colors.textPrimary}
      />
    </TouchableOpacity>

    {/* Title */}
    <Text style={styles.title}>{title}</Text>

    {/* Profile avatar/icon */}
   {onProfilePress && <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
      <Ionicons
        name="person-circle-outline"
        size={28}
        color={theme.colors.textPrimary}
      />
    </TouchableOpacity>}
  </View>
)

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: theme.fontSizes.titleLarge,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
})
