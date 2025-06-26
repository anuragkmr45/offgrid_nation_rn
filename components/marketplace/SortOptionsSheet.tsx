// app/marketplace/components/SortOptionsSheet.tsx
import { BottomSheet } from '@/components/common/BottomSheet'
import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface Props {
  visible: boolean
  onClose: () => void
  selectedOption: string
  onSelect: (option: string) => void
}

export const SortOptionsSheet: React.FC<Props> = ({
  visible,
  onClose,
  selectedOption,
  onSelect,
}) => {
  const options = [
    { key: 'relevance', label: 'Relevance' },
    { key: 'popularity', label: 'Popularity' },
    { key: 'priceAsc', label: 'Price – low to high' },
    { key: 'priceDesc', label: 'Price – high to low' },
    { key: 'rating', label: 'Ratings – high to low' },
    { key: 'recent', label: 'Recently Uploaded' },
  ]

  return (
    <BottomSheet visible={visible} onClose={onClose} height="48%">
      <Text style={styles.title}>Sort By:</Text>
      {options.map(opt => (
        <TouchableOpacity
          key={opt.key}
          style={styles.row}
          onPress={() => {
            onSelect(opt.key)
            onClose()
          }}
        >
          <Text style={styles.label}>{opt.label}</Text>
          <Ionicons
            name={selectedOption === opt.key ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color={selectedOption === opt.key ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      ))}
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: theme.fontSizes.headlineSmall,
    fontWeight: '700',
    marginBottom: 12,
    color: theme.colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.textSecondary,
  },
  label: {
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textPrimary,
  },
})
