// components/marketplace/ProductDetailsInfo.tsx

import { ProductDetails } from '@/app/root/marketplace/ProductDetails'
import { AVATAR_FALLBACK, CATEGORY_ICON_FALLBACK } from '@/constants/AppConstants'
import { theme } from '@/constants/theme'
import { timeAgo } from '@/utils/timeAgo'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Location from 'expo-location'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import { AccountCard } from '../search/AccountCard'

export const ProductDetailsInfo: React.FC<{ product: ProductDetails }> = ({
  product,
}) => {
  const [readableLocation, setReadableLocation] = useState<string | undefined>()
  const [locLoading, setLocLoading] = useState(true)

  const { title, price, condition, description, category: { title: categoryTitle, imageUrl }, clickCount, createdAt, isSold, location: { coordinates }, owner: { fullName, profilePicture, username } } = product || {};

  useEffect(() => {
    const [lng, lat] = coordinates || product?.location?.coordinates || {};
    (async () => {
      try {
        const res = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng })
        if (res.length) {
          const place = res[0]
          setReadableLocation(`${place.city ?? place.region}, ${place.country}`)
        }
      } catch {
        setReadableLocation('Unknown')
      } finally {
        setLocLoading(false)
      }
    })()
  }, [product.location])

  return (
    <>
      <View style={styles.gridRow}>
        <View style={styles.colSpan2}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.categoryRow}>
            <Image
              source={{ uri: imageUrl ?? CATEGORY_ICON_FALLBACK }}
              resizeMode="contain"
              style={styles.categoryIcon}
            />
            <Text style={styles.value}>{categoryTitle}</Text>
          </View>
        </View>
        <Text style={[styles.price, styles.colSpan1]}>${price}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Product Details</Text>

        <Text style={styles.description}>{description}</Text>

        <Text style={{ marginVertical: 16, fontSize: 20, fontWeight: '600' }}>Additional Details</Text>

        {/* Category row */}
        <View style={styles.detailRow}>
          <Ionicons
            name="pricetag-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{categoryTitle}</Text>
          </View>
        </View>

        {/* Views row */}
        <View style={styles.detailRow}>
          <Ionicons
            name="eye-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.label}>Views:</Text>
            <Text style={styles.value}>{clickCount}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name="hammer-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.label}>Condition:</Text>
            <Text style={styles.value}>{condition}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.label}>Listing Date:</Text>
            <Text style={styles.value}>{timeAgo(createdAt)}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name={isSold ? 'close-circle-outline' : 'checkmark-circle-outline'}
            size={20}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.label}>Availability:</Text>
            <Text style={styles.value}>{isSold ? 'Sold Out' : 'In Stock'}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name="location-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.label}>Location:</Text>
            {locLoading
              ? <ActivityIndicator size="small" color={theme.colors.primary} />
              : <Text style={styles.value}>{readableLocation}</Text>
            }
          </View>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Seller Details</Text>
      <AccountCard avatarUrl={profilePicture ?? AVATAR_FALLBACK} fullName={fullName} handle={username} />
    </>
  )
}

const styles = StyleSheet.create({
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colSpan2: {
    flex: 2,
    marginRight: 8,
  },
  colSpan1: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,      // optional spacing above category
  }, categoryIcon: {
    height: 23,
    width: 23,
    borderRadius: 100,
    marginRight: 4,    // small space between icon & text
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: 'green',
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginRight: 4,
  },
  value: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 18,
    padding: 16,
    marginVertical: 16,
    backgroundColor: '#fff',           // white background
    shadowColor: '#000',               // subtle shadow (iOS)
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,                      // subtle shadow (Android)
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 16,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
})
