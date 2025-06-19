// components/marketplace/ProductGrid.tsx

import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: any
  onPress:  (id: string) => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onPress }) => (
  <FlatList
    data={products}
    keyExtractor={(p) => p.id}
    numColumns={2}
    columnWrapperStyle={styles.row}
    contentContainerStyle={styles.grid}
    renderItem={({ item }) => (
      <ProductCard product={item} onPress={onPress} />
    )}
    showsVerticalScrollIndicator={false}
  />
)

const styles = StyleSheet.create({
  grid: {
    paddingVertical: 16,
  },
  row: {
    justifyContent: 'flex-start',   // <-- centers the two cards in each row
  },
})
