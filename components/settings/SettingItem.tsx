// components/settings/SettingItem.tsx

import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native'

export interface SettingItemProps {
  /** Ionicon name, e.g. "person-circle-outline" */
  iconName: React.ComponentProps<typeof Ionicons>['name']
  title: string
  subtitle?: string
  onPress: () => void
  /** Optional container style override */
  style?: ViewStyle
}

export const SettingItem: React.FC<SettingItemProps> = ({
  iconName,
  title,
  subtitle,
  onPress,
  style,
}) => (
  <TouchableOpacity onPress={onPress} style={[styles.row, style]} activeOpacity={0.7}>
    <View style={styles.iconWrapper}>
      <Ionicons name={iconName} size={24} color={theme.colors.primary} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  row: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.textSecondary + '33',
  },
  iconWrapper: {
    width:            36,
    height:           36,
    borderRadius:     18,
    backgroundColor:  theme.colors.textSecondary + '22',
    justifyContent:   'center',
    alignItems:       'center',
    marginRight:      12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize:   theme.fontSizes.bodyLarge,
    color:      theme.colors.textPrimary,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 4,
    fontSize:  theme.fontSizes.bodyMedium,
    color:     theme.colors.textSecondary,
  },
})
