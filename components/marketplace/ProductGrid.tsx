// // components/marketplace/ProductGrid.tsx

import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { ProductCard } from './ProductCard'

interface GridProduct {
  id: string
  imageUrl: string
  price: string
  title: string
}

interface ProductGridProps {
  products: GridProduct[]
  onPress: (id: string) => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onPress }) => (
  <FlatList
    data={products}
    keyExtractor={(item) => item.id}
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
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
})
