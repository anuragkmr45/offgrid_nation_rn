// components/marketplace/FilterBar.tsx
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { FilterButton, FilterButtonProps } from './FilterButton'

export interface FilterItem {
  label:    string
  icon:     FilterButtonProps['icon']
  onPress:  () => void
}

export interface FilterBarProps {
  items: FilterItem[]
}

export const FilterBar: React.FC<FilterBarProps> = ({ items }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.container}
  >
    {items.map((item) => (
      <FilterButton
        key={item.label}
        label={item.label}
        icon={item.icon}
        onPress={item.onPress}
      />
    ))}
  </ScrollView>
)

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical:   8,
  },
})
