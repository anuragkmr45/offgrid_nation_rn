// app/marketplace/[productId].tsx

import { Button } from '@/components/common'
import { MediaCarousel } from '@/components/common/MediaCarousel'
import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader'
import { ProductDetailsInfo } from '@/components/marketplace/ProductDetailsInfo'
import { theme } from '@/constants/theme'
import { User } from '@/features/auth/types'
import { useSendMessageMutation } from '@/features/chat/api/chatApi'
import { RootState } from '@/store/store'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { useSelector } from 'react-redux'

interface Owner {
  _id: string
  username: string
  profilePicture: string
}
interface Category {
  id: string
  title: string
}
export interface ProductDetails {
  id: string
  title: string
  price: number
  condition: string
  description: string
  category: Category
  owner: Owner
  clickCount: number
  location: { coordinates: [number, number] }
  images: string[]
}

export default function ProductDetailsScreen() {
  const { productId = "" } = useLocalSearchParams<{ productId: string }>()
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [sendMessage, { isLoading: sending, error: sendError }] = useSendMessageMutation()
  const currentUser = useSelector((state: RootState) => state.auth.user) as User | null

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()
  const [product, setProduct] = useState<ProductDetails | null>(null)

  useEffect(() => {
    if (!productId) return
    setLoading(true)
    fetch(`https://api.theoffgridnation.com/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(r => {
        if (!r.ok) throw new Error('Network error')
        return r.json()
      })
      .then((data: ProductDetails) => {
        setProduct(data)
        setError(undefined)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [productId])

  const handleChat = async () => {
    if (!product) return
    try {
      const payload = {
        recipient: product.owner._id,
        actionType: 'text' as const,
        text: `HII!, i am instreade in ${product.title}`,
      }
      await sendMessage(payload).unwrap()

      Toast.show({
        type: "success",
        text1: "Enquiry made successfully!!"
      })
      // Optionally, now navigate into the conversation:
      // router.push({
      //   pathname: '/root/chat/Conversation',
      //   params: {
      //     recipientId: product.owner.userId,
      //     recipientName: product.owner.username,
      //     profilePicture: product.owner.profilePicture,
      //   },
      // })
    } catch (err) {
      Toast.show({
        type: "success",
        text1: "Enquiry fails!!"
      })
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ProtectedLayout>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </ProtectedLayout>
      </SafeAreaView>
    )
  }
  if (error || !product) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar barStyle="dark-content" animated />
        <ProtectedLayout>
          <Text style={styles.errorText}>Failed to load product details.</Text>
        </ProtectedLayout>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" animated backgroundColor={theme.colors.background} />
      <ProtectedLayout>
        <MarketplaceHeader title={product.title.toUpperCase()} onBack={() => { router.back() }} />
        {/* Carousel + Info */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <MediaCarousel mediaUrls={product.images} />

          <View style={styles.infoWrapper}>
            <ProductDetailsInfo product={product} />
          </View>
        </ScrollView>
        {product?.owner?._id !== currentUser?._id && (
          <View style={styles.footer}>
            <Button
              text={"ENQUIRY"}
              onPress={handleChat}
              style={styles.chatButton}
              textColor={theme.colors.background}
            />
          </View>
        )}
      </ProtectedLayout>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 80, // leave room for footer
  },
  infoWrapper: {
    padding: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.textSecondary,
    backgroundColor: theme.colors.background,
  },
  chatButton: {
    borderRadius: theme.borderRadius,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.bodyLarge,
  },
})
