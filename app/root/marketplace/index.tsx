// app/marketplace/index.tsx

import { SearchBar } from '@/components/common'
import { BottomSheet } from '@/components/common/BottomSheet'
import { FilterBar, FilterItem } from '@/components/marketplace/buttons/FilterBar'
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader'
import { ProductGrid } from '@/components/marketplace/ProductGrid'
import { SectionHeader } from '@/components/marketplace/SectionHeader'
import { theme } from '@/constants/theme'
import { useListProductsQuery } from '@/features/products/api/productsApi'
import { useListCategories } from '@/features/products/hooks/useProducts'
import { Product } from '@/features/products/types'
import { getFormattedLocation, requestLocationPermission } from '@/utils/location'
import { Ionicons } from '@expo/vector-icons'
import { skipToken } from '@reduxjs/toolkit/query/react'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MarketplaceScreen() {
  const router = useRouter()

  // Bottom‐sheet visibility
  const [isSellSheetVisible, setSellSheetVisible] = useState(false)
  const [isCatSheetVisible, setCatSheetVisible] = useState(false)
  const [isSortSheetVisible, setSortSheetVisible] = useState(false)

  // Filters & search
  const [catQuery, setCatQuery] = useState('')
  const [sortOption, setSortOption] = useState<string>('relevance')
  const [searchQuery, setSearchQuery] = useState('')

  // Readable location string
  const [readableLocation, setReadableLocation] = useState<string>('')

  // Store coords so RTK Query can fire
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null)
console.log({coords});

  // RTK Query for products; skips until coords != null
  const {
    data: productsResponse,
    isLoading: isLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useListProductsQuery(coords ?? skipToken)

  // extract items array
  const products: Product[] = productsResponse?.items ?? []

  // Categories hook (unchanged)
  const {
    categories = [],
    isLoading: isCatsLoading,
    error: catsError,
    refetch: refetchCats,
  } = useListCategories()

  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(catQuery.toLowerCase())
  )

  // Master fetch function: gets coords, sets state; RTK Query runs automatically
  const fetchData = async (query?: string) => {
    const granted = await requestLocationPermission()
    if (!granted) return

    const formatted = await getFormattedLocation()
    if (!formatted?.length) {
      console.warn('Invalid coordinates:', formatted)
      return
    }

    const [latStr, lngStr] = formatted.split(',')
    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)
    setCoords({ latitude: lat, longitude: lng })

    const rev = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng })
    if (rev.length) {
      const place = rev[0]
      setReadableLocation(`${place.city ?? place.region}, ${place.country}`)
    }

    if (query) {
      setSearchQuery(query)
      // you can hook into useSearchProductsQuery here if desired
    }
  }

  // initial load
  useEffect(() => {
    fetchData()
  }, [])

  // Filter buttons (unchanged)
  const filters: FilterItem[] = [
    { label: 'Search', icon: 'search-outline', onPress: () => console.log('Search') },
    { label: 'Sell', icon: 'pricetag-outline', onPress: () => setSellSheetVisible(true) },
    { label: 'Sort By', icon: 'chevron-down-outline', onPress: () => setSortSheetVisible(true) },
    { label: 'Category', icon: 'list-outline', onPress: () => setCatSheetVisible(true) },
  ]

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={theme.colors.background} animated barStyle={'dark-content'} />
      <MarketplaceHeader
        onBack={() => router.back()}
        onProfilePress={() => router.push('/root/profile/ProfileScreen')}
      />

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.textPrimary} />
        </View>
      ) : productsError ? (
        <Text style={styles.errorText}>Error loading products.</Text>
      ) : (
        <>
          <FilterBar items={filters} onSearchChange={(q) => fetchData(q)} />

          <SectionHeader title="Today’s picks" location={readableLocation} />

          <ProductGrid
            products={productsResponse}
            onPress={(productId: string) =>
              router.push({
                pathname: '/root/marketplace/ProductDetails',
                params: { productId },
              })
            }
          />

          {/* Sort Sheet */}
          <BottomSheet
            visible={isSortSheetVisible}
            onClose={() => setSortSheetVisible(false)}
            height="60%"
          >
            <Text style={sheetStyles.sheetTitle}>Sort By:</Text>
            {[
              { key: 'relevance', label: 'Relevance' },
              { key: 'popularity', label: 'Popularity' },
              { key: 'price_low_high', label: 'Price – low to high' },
              { key: 'price_high_low', label: 'Price – high to low' },
              { key: 'ratings', label: 'Ratings – high to low' },
              { key: 'recent', label: 'Recently Uploaded' },
            ].map((opt) => {
              const selected = sortOption === opt.key
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={sheetStyles.row}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSortOption(opt.key)
                    setSortSheetVisible(false)
                    // if needed, trigger refetch with new sort:
                    refetchProducts()
                  }}
                >
                  <Text style={sheetStyles.rowText}>{opt.label}</Text>
                  <Ionicons
                    name={selected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={selected ? theme.colors.primary : theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              )
            })}
          </BottomSheet>

          {/* Category Sheet */}
          <BottomSheet
            visible={isCatSheetVisible}
            onClose={() => {
              setCatSheetVisible(false)
              setCatQuery('')
            }}
            height="70%"
          >
            <SearchBar
              value={catQuery}
              onChangeText={setCatQuery}
              placeholder="Search categories"
            />

            {isCatsLoading ? (
              <ActivityIndicator style={{ marginTop: 20 }} />
            ) : catsError ? (
              <Text style={{ marginTop: 20, textAlign: 'center' }}>
                Failed to load categories.
              </Text>
            ) : (
              <ScrollView style={{ marginTop: 8 }}>
                {filteredCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat._id}
                    style={sheetStyles.catRow}
                    activeOpacity={0.7}
                    onPress={() => {
                      console.log('Chosen category ID:', cat._id)
                      setCatSheetVisible(false)
                      setCatQuery('')
                      // if you want to filter by category, you can call:
                      // refetchProducts()
                    }}
                  >
                    <Image
                      source={{ uri: cat.imageUrl }}
                      style={sheetStyles.catImage}
                      resizeMode="cover"
                    />
                    <Text style={sheetStyles.catText}>{cat.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </BottomSheet>

          {/* Sell Sheet */}
          <BottomSheet
            visible={isSellSheetVisible}
            onClose={() => setSellSheetVisible(false)}
            height={300}
          >
            <Text
              style={{
                fontSize: theme.fontSizes.headlineSmall,
                fontWeight: '700',
                marginBottom: 16,
              }}
            >
              Create your listing
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/root/marketplace/AddProductScreen')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: theme.colors.textSecondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 8,
                }}
              >
                <Ionicons name="add" size={20} color={theme.colors.background} />
              </View>
              <Text style={{ fontSize: theme.fontSizes.bodyMedium, fontWeight: '600' }}>
                Add items
              </Text>
            </TouchableOpacity>
          </BottomSheet>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: theme.colors.accent,
  },
})

const sheetStyles = StyleSheet.create({
  sheetTitle: {
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
  rowText: {
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textPrimary,
  },
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


// app/marketplace/TestProductsScreen.tsx

// import { useListProductsQuery } from '@/features/products/api/productsApi'
// import { skipToken } from '@reduxjs/toolkit/query/react'
// import * as Location from 'expo-location'
// import React, { useEffect, useState } from 'react'
// import { Text, View } from 'react-native'

// export default function TestProductsScreen() {
//   // hold coords until we get them
//   const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null)

//   // RTK Query will skip until coords !== null
//   const { data: productsData, isLoading, error } = useListProductsQuery(
//     coords ?? skipToken
//   )

//   // fetch location once on mount
//   useEffect(() => {
//     ;(async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync()
//       if (status === 'granted') {
//         const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync()
//         setCoords({ latitude, longitude })
//       } else {
//         console.warn('Location permission not granted')
//       }
//     })()
//   }, [])

//   // log the products data whenever it changes
//   useEffect(() => {
//     console.log('useListProductsQuery data:', productsData)
//   }, [productsData])

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       {isLoading && <Text>Loading products…</Text>}
//       {error && <Text>Error loading products</Text>}
//       {!isLoading && !error && <Text>Check console for productsData</Text>}
//     </View>
//   )
// }
