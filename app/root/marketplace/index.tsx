// app/marketplace/index.tsx

import { SearchBar } from '@/components/common'
import { BottomSheet } from '@/components/common/BottomSheet'
import { FilterBar, FilterItem } from '@/components/marketplace/buttons/FilterBar'
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader'
import { ProductGrid } from '@/components/marketplace/ProductGrid'
import { SectionHeader } from '@/components/marketplace/SectionHeader'
import { theme } from '@/constants/theme'
import { Product } from '@/features/products/types'
import { RootState } from '@/store/store'
import { getFormattedLocation, requestLocationPermission } from '@/utils/location'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

export default function MarketplaceScreen() {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const router = useRouter();
    const [isSellSheetVisible, setSellSheetVisible] = useState(false)
    const [isCatSheetVisible, setCatSheetVisible] = useState(false)
    const [catQuery, setCatQuery] = useState('')
    const [isSortSheetVisible, setSortSheetVisible] = useState(false)
    const [sortOption, setSortOption] = useState<string>('relevance')
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [readableLocation, setReadableLocation] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState('');


    // ---- Top filter buttons ----
    const filters: FilterItem[] = [
        { label: 'Search', icon: 'search-outline', onPress: () => console.log('Search') },
        { label: 'Sell', icon: 'pricetag-outline', onPress: () => setSellSheetVisible(true) },
        { label: 'Sort By', icon: 'chevron-down-outline', onPress: () => setSortSheetVisible(true) },
        { label: 'Category', icon: 'list-outline', onPress: () => setCatSheetVisible(true) },
    ]

    const ALL_CATEGORIES = [
        'Electronics', 'Furniture', 'Clothing', 'Books', 'Toys', 'Art', 'Garden', 'Sports', 'sdf', 'sds'
    ]
    const filteredCats = ALL_CATEGORIES.filter(c =>
        c.toLowerCase().includes(catQuery.toLowerCase())
    )

    const productAPICall = async (lat: number, lng: number) => {
        const response = await fetch(`https://api.theoffgridnation.com/products?latitude=${lat}&longitude=${lng}&limit=5&sort=${sortOption}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        const mapped: Product[] = data.map((item: any) => ({
            id: item._id,
            title: item.title,
            price: `$${item.price}`,
            imageUrl: item.images?.[0],
        }));

        setProducts(mapped);
    }

    const handleSearch = async (lat: number, lng: number, query?: string) => {
        setSearchQuery(query || "");
        const response = await fetch(`https://api.theoffgridnation.com/productsproduct/search?q=${query}?&lng=${lng}lat=${lat}&limit=5&page=1`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();

        const mapped: Product[] = data.map((item: any) => ({
            id: item._id,
            title: item.title,
            price: `$${item.price}`,
            imageUrl: item.images?.[0],
        }));

        setProducts(mapped);
    }

    const fetchData = async (query?: string) => {
        setIsLoading(true)
        try {
            const granted = await requestLocationPermission();
            if (!granted) {
                return;
            }

            const formatted: string | null = await getFormattedLocation();

            if (formatted?.length !== 0) {
                const [latStr, lngStr] = formatted?.split(',') || "";
                const lat = parseFloat(latStr);
                const lng = parseFloat(lngStr);
                const readableLoc = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng })
                if (readableLoc.length) {
                    const place = readableLoc[0]
                    setReadableLocation(`${place.city ?? place.region}, ${place.country}`)
                }

                if (query) {
                    await handleSearch(lng, lat, query)
                } else {
                    await productAPICall(lat, lng);
                }

            } else {
                console.warn('Invalid coordinates:', formatted);
            }
        } catch (error) {
            console.error("product not fetched")
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaView>
            <StatusBar backgroundColor={theme.colors.background} animated />
            <MarketplaceHeader
                onBack={() => router.back()}
                onProfilePress={() => router.push('/profile')}
            />
            {
                isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={theme.colors.textPrimary} />
                    </View>
                ) : (
                    <>
                        <FilterBar
                            items={filters}
                            onSearchChange={q => fetchData(q)}
                        />

                        <SectionHeader
                            title="Today’s picks"
                            location={readableLocation}
                        />

                        <ProductGrid
                            products={products}
                            onPress={(productId: string) => router.push({ pathname: '/root/marketplace/ProductDetails', params: { productId } })}
                        />

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
                            ].map(opt => {
                                const selected = sortOption === opt.key
                                return (
                                    <TouchableOpacity
                                        key={opt.key}
                                        style={sheetStyles.row}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setSortOption(opt.key)
                                            setSortSheetVisible(false)
                                            // TODO: actually sort your products array here
                                            console.log('Sort by', opt.key)
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

                        <BottomSheet
                            visible={isCatSheetVisible}
                            onClose={() => { setCatSheetVisible(false); setCatQuery('') }}
                            height="70%"
                        >
                            {/* Search inside sheet */}
                            <SearchBar
                                value={catQuery}
                                onChangeText={setCatQuery}
                                placeholder="Search categories"
                            />

                            {/* Scrollable list */}
                            <ScrollView style={{ marginTop: 8 }}>
                                {filteredCats.map(cat => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={sheetStyles.catRow}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            console.log('Chosen category', cat)
                                            setCatSheetVisible(false)
                                            setCatQuery('')
                                        }}
                                    >
                                        <Text style={sheetStyles.catText}>{cat}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </BottomSheet>

                        <BottomSheet
                            visible={isSellSheetVisible}
                            onClose={() => setSellSheetVisible(false)}
                            height={300}
                        >
                            <Text style={{ fontSize: theme.fontSizes.headlineSmall, fontWeight: "700", marginBottom: 16 }}>Create your listing</Text>
                            <TouchableOpacity onPress={() => { }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
                                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.textSecondary, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                                    <Ionicons name="add" size={20} color={theme.colors.background} />
                                </View>
                                <Text style={{ fontSize: theme.fontSizes.bodyMedium, fontWeight: "600" }}>Add items</Text>
                            </TouchableOpacity>
                        </BottomSheet>
                    </>
                )
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
})

const sheetStyles = StyleSheet.create({
    catRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.textSecondary,
    },
    catText: {
        fontSize: theme.fontSizes.bodyMedium,
        color: theme.colors.textPrimary,
        paddingHorizontal: 8,
    },
    sheetTitle: {
        fontSize: theme.fontSizes.headlineSmall,
        fontWeight: "700",
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
})