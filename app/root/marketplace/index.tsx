// app/marketplace/MarketplaceScreen.tsx

import { CategorySheet } from '@/components/marketplace/CategorySheet'
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters'
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader'
import { ProductGrid } from '@/components/marketplace/ProductGrid'
import { SectionHeader } from '@/components/marketplace/SectionHeader'
import { SellSheet } from '@/components/marketplace/SellSheet'
import { SortOptionsSheet } from '@/components/marketplace/SortOptionsSheet'
import { theme } from '@/constants/theme'
import { useListProductsQuery } from '@/features/products/api/productsApi'
import { useListCategories } from '@/features/products/hooks/useProducts'
import { Product } from '@/features/products/types'
import { getFormattedLocation, requestLocationPermission } from '@/utils/location'
import { skipToken } from '@reduxjs/toolkit/query/react'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MarketplaceScreen() {
  const router = useRouter()

  const [isSellSheetVisible, setSellSheetVisible] = useState(false)
  const [isCatSheetVisible, setCatSheetVisible] = useState(false)
  const [isSortSheetVisible, setSortSheetVisible] = useState(false)
  const [isScreenReady, setScreenReady] = useState(false)
  const [catQuery, setCatQuery] = useState('')
  const [sortOption, setSortOption] = useState<string>('relevance')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [readableLocation, setReadableLocation] = useState<string>('')

  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null)

  const queryParams = useMemo(() => {
    if (!coords) return skipToken
    return {
      latitude: coords?.latitude ?? 38.90,
      longitude: coords?.longitude ?? 77.03,
      sort: sortOption || "",
      category: selectedCategoryId || "",
    }
  }, [coords, sortOption, selectedCategoryId])

  const {
    data: productsResponse,
    isLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useListProductsQuery(queryParams)

  const products: Product[] = (productsResponse as any) ?? []

  const {
    categories = [],
    isLoading: isCatsLoading,
    error: catsError,
  } = useListCategories()

  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(catQuery.toLowerCase())
  )

  const fetchData = async (query?: string, categoryId?: string) => {
    try {
      const granted = await requestLocationPermission()
      if (!granted) return

      let formatted: string | null = null
      let retries = 0

      while (!formatted && retries < 5) {
        formatted = await getFormattedLocation()
        if (formatted) break
        await new Promise((res) => setTimeout(res, 500))
        retries++
      }

      if (!formatted) {
        console.warn('Could not fetch location after retries')
        return
      }

      const [latStr, lngStr] = formatted.split(',')
      const lat = parseFloat(latStr)
      const lng = parseFloat(lngStr)

      setCoords({ latitude: lat, longitude: lng })

      const rev = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng }).catch(() => [])
      if (rev.length) {
        const place = rev[0]
        setReadableLocation(`${place.city ?? place.region}, ${place.country}`)
      }

      if (query) setSearchQuery(query)
      if (categoryId) setSelectedCategoryId(categoryId)

      setScreenReady(true)
    } catch (err) {
      console.error('[fetchData] error:', err)
    }
  }


  useEffect(() => {
    const timeout = setTimeout(() => {
      setScreenReady(true) // fallback to show UI anyway
    }, 5000)

    fetchData()

    return () => clearTimeout(timeout)
  }, [])

  if (!isScreenReady || (isLoading && products.length === 0)) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar backgroundColor={theme.colors.background} animated barStyle="dark-content" />
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color={theme.colors.textPrimary} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar backgroundColor={theme.colors.background} animated barStyle="dark-content" />
      <MarketplaceHeader
        onBack={() => router.back()}
        onProfilePress={() => router.push('/root/profile/ProfileScreen')}
      />
      {isLoading ? (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color={theme.colors.textPrimary} />
        </View>
      ) : productsError ? (
        <Text style={styles.errorText}>Error loading products.</Text>
      ) : (
        <>
        <View>
          <MarketplaceFilters
            onSearchChange={(q) => fetchData(q)}
            onSellPress={() => setSellSheetVisible(true)}
            onSortPress={() => setSortSheetVisible(true)}
            onCategoryPress={() => setCatSheetVisible(true)}
          />
        </View>

          <SectionHeader title="Today’s picks" location={readableLocation} />

          {products.length === 0 ? (
            <Text style={styles.emptyText}>No products found.</Text>
          ) : (
            <ProductGrid
              products={products?.map((item) => ({
                id: item._id,
                title: item.title,
                price: `$${item.price}`,
                imageUrl: item.images?.[0] ?? 'https://via.placeholder.com/300x300?text=No+Image',
              }))}
              onPress={(productId: string) =>
                router.push({
                  pathname: '/root/marketplace/ProductDetails',
                  params: { productId },
                })
              }
            />
          )}

          <SortOptionsSheet
            visible={isSortSheetVisible}
            onClose={() => setSortSheetVisible(false)}
            selectedOption={sortOption}
            onSelect={(opt) => {
              setSortOption(opt)
              refetchProducts()
            }}
          />

          <CategorySheet
            visible={isCatSheetVisible}
            onClose={() => {
              setCatSheetVisible(false)
              setCatQuery('')
            }}
            searchQuery={catQuery}
            onSearchChange={setCatQuery}
            categories={filteredCategories}
            isLoading={isCatsLoading}
            error={catsError}
            onSelectCategory={(id, title) => {
              setCatQuery(title)
              setCatSheetVisible(false)
              fetchData(undefined, id)
            }}
          />

          <SellSheet
            visible={isSellSheetVisible}
            onClose={() => setSellSheetVisible(false)}
            onAddProduct={() => router.push('/root/marketplace/AddProductScreen')}
          />
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: theme.colors.accent,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.bodyMedium,
  },
})
