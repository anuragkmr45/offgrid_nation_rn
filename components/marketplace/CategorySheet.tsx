// app/marketplace/components/CategorySheet.tsx
import { SearchBar } from '@/components/common'
import { BottomSheet } from '@/components/common/BottomSheet'
import { theme } from '@/constants/theme'
import React from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'

interface Props {
  visible: boolean
  onClose: () => void
  searchQuery: string
  onSearchChange: (text: string) => void
  categories: { _id: string; title: string; imageUrl: string }[]
  isLoading: boolean
  error?: any
  onSelectCategory: (catId: string, title: string) => void
}

export const CategorySheet: React.FC<Props> = ({
  visible,
  onClose,
  searchQuery,
  onSearchChange,
  categories,
  isLoading,
  error,
  onSelectCategory,
}) => {
  return (
    <BottomSheet visible={visible} onClose={onClose} height="60%">
      <SearchBar value={searchQuery} onChangeText={onSearchChange} placeholder="Search categories" />

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={{ marginTop: 20, textAlign: 'center' }}>Failed to load categories.</Text>
      ) : (
        <ScrollView style={{ marginTop: 8 }}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat._id}
              style={styles.catRow}
              activeOpacity={0.7}
              onPress={() => onSelectCategory(cat._id, cat.title)}
            >
              <Image source={{ uri: cat.imageUrl }} style={styles.catImage} resizeMode="cover" />
              <Text style={styles.catText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.textSecondary,
  },
  catImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  catText: {
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textPrimary,
  },
})
