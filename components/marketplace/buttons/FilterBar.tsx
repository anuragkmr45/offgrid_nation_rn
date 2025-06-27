// components/marketplace/buttons/FilterBar.tsx
import { debounce } from '@/utils/debounce'
import { Ionicons } from '@expo/vector-icons'
import React, { useRef, useState } from 'react'
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  UIManager,
  View,
} from 'react-native'
import { FilterButton } from './FilterButton'

export interface FilterItem {
  label: string
  icon: React.ComponentProps<typeof Ionicons>['name']
  onPress: () => void
}

export interface FilterBarProps {
  items: FilterItem[]
  onSearchChange?: (query: string) => void
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export const FilterBar: React.FC<FilterBarProps> = ({ items, onSearchChange }) => {
  const scrollRef = useRef<ScrollView>(null)
  const [searchActive, setSearchActive] = useState(false)
  const [query, setQuery] = useState('')

  // Debounced callback passed from parent
  const debouncedSearch = useRef(
    debounce((text: string) => {
      if (onSearchChange) onSearchChange(text)
    }, 400)
  ).current

  const handleSearchPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setSearchActive(true)
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true })
    }, 300)
  }

  const handleTextChange = (text: string) => {
    setQuery(text)
    debouncedSearch(text)
  }

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {!searchActive ? (
        <FilterButton
          label="Search"
          icon="search-outline"
          onPress={handleSearchPress}
        />
      ) : (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color="gray" />
          <TextInput
            value={query}
            onChangeText={handleTextChange}
            placeholder="Search items"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>
      )}

      {items
        .filter(item => item.label !== 'Search')
        .map(item => (
          <FilterButton
            key={item.label}
            label={item.label}
            icon={item.icon}
            onPress={item.onPress}
          />
        ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    height: 75,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  searchInput: {
    marginLeft: 6,
    fontSize: 14,
    minWidth: 120,
    color: '#000',
  },
})
