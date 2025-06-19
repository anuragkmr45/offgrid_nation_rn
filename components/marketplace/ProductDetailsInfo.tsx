// components/marketplace/ProductDetailsInfo.tsx

import { ProductDetails } from '@/app/root/marketplace/ProductDetails'
import { theme } from '@/constants/theme'
import * as Location from 'expo-location'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

export const ProductDetailsInfo: React.FC<{ product: ProductDetails }> = ({
  product,
}) => {
  const [readableLocation, setReadableLocation] = useState<string|undefined>()
  const [locLoading, setLocLoading] = useState(true)

  useEffect(() => {
    const [lng, lat] = product.location.coordinates
    ;(async () => {
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

  const labelStyle = { ...styles.label }

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>

      <Text style={labelStyle}>Condition:</Text>
      <Text style={styles.value}>{product.condition}</Text>

      <Text style={labelStyle}>Description:</Text>
      <Text style={styles.value}>{product.description}</Text>

      <Text style={labelStyle}>Category:</Text>
      <Text style={styles.value}>{product.category.title}</Text>

      <Text style={labelStyle}>Posted by:</Text>
      <Text style={styles.value}>{product.owner.username}</Text>

      <Text style={labelStyle}>Views:</Text>
      <Text style={styles.value}>{product.clickCount}</Text>

      <Text style={labelStyle}>Location:</Text>
      {locLoading
        ? <ActivityIndicator size="small" color={theme.colors.primary} />
        : <Text style={styles.value}>{readableLocation}</Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection:    'row',
    justifyContent:   'space-between',
    alignItems:       'center',
    marginBottom:     12,
  },
  title: {
    fontSize:       28,
    fontWeight:     '700',
    color:          theme.colors.textPrimary,
    flex:           1,
  },
  price: {
    fontSize:       20,
    fontWeight:     '600',
    color:          'green',
    marginLeft:     12,
  },
  label: {
    fontSize:       14,
    fontWeight:     '600',
    color:          theme.colors.textSecondary,
    marginTop:      12,
  },
  value: {
    fontSize:   16,
    color:      theme.colors.textPrimary,
    marginTop:  4,
  },
})
