// components/common/Header.tsx

import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

export interface HeaderProps {
  /** Header title text */
  title?: string
  /** Callback when back arrow is pressed */
  onBack: () => void
  /** Background color of the header */
  backgroundColor?: string
  /** Color of the header title text */
  titleColor?: string
  /** Color of the back arrow icon */
  iconColor?: string
  /** If true, render a drop shadow/ elevation */
  showShadow?: boolean
  /** Additional style overrides */
  style?: ViewStyle
}

/**
 * A common header with back button, title, and optional shadow.
 */
const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  backgroundColor = theme.colors.background,
  titleColor = theme.colors.textPrimary,
  iconColor = theme.colors.textPrimary,
  showShadow = false,
  style,
}) => (
  <View
    style={[
      styles.container,
      { backgroundColor },
      showShadow && styles.shadow,
      style,
    ]}
  >
    <TouchableOpacity onPress={onBack} style={styles.iconButton}>
      <Ionicons name="arrow-back" size={24} color={iconColor} />
    </TouchableOpacity>

    <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
      {title}
    </Text>

    {/* spacer to balance layout */}
    <View style={styles.iconButton} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fontSizes.titleLarge,
    fontWeight: '600',
  },
  shadow: {
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android elevation
    elevation: 4,
  },
})

export default Header
