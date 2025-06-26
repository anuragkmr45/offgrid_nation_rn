// app/marketplace/components/MarketplaceFilters.tsx
import { FilterBar, FilterItem } from '@/components/marketplace/buttons/FilterBar'
import React from 'react'

interface Props {
  onSearchChange: (query: string) => void
  onSellPress: () => void
  onSortPress: () => void
  onCategoryPress: () => void
}

export const MarketplaceFilters: React.FC<Props> = ({
  onSearchChange,
  onSellPress,
  onSortPress,
  onCategoryPress,
}) => {
  const filters: FilterItem[] = [
    { label: 'Search', icon: 'search-outline', onPress: () => {} },
    { label: 'Sell', icon: 'pricetag-outline', onPress: onSellPress },
    { label: 'Sort By', icon: 'chevron-down-outline', onPress: onSortPress },
    { label: 'Category', icon: 'list-outline', onPress: onCategoryPress },
  ]

  return <FilterBar items={filters} onSearchChange={onSearchChange} />
}
