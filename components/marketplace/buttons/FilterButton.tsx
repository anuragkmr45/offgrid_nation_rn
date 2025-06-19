// components/marketplace/FilterButton.tsx
import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export interface FilterButtonProps {
  label: string
  /** e.g. 'search-outline', 'pricetag-outline', 'chevron-down-outline', 'list-outline' */
  icon: React.ComponentProps<typeof Ionicons>['name']
  onPress: () => void
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  icon,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.button}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <Ionicons
      name={icon}
      size={12}
      color={theme.colors.textPrimary}
      style={styles.icon}
    />
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.textPrimary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.bodyMedium,
    fontWeight: "600",
  },
})
