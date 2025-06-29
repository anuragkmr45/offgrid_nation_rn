// app/add-post/index.tsx

import { WithLayout } from '@/components/layouts/WithLayout'
import { MediaCarousel } from '@/components/post/MediaCarousel'
import { PostComposer } from '@/components/post/PostComposer'
import { theme } from '@/constants/theme'
import { useCreatePostMutation } from '@/features/content/post/api/postApi'
import {
  pickFromCamera,
  pickMultipleFromGallery
} from '@/utils/imagePicker'
import { getFormattedLocation } from '@/utils/location'
import { MediaTypeOptions } from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Toast from 'react-native-toast-message'

export default function AddPostRoute() {
  const [media, setMedia] = useState<string[]>([])
  const [location, setLocation] = useState<string | null>(null)
  const router = useRouter()

  // RTK-Query mutation hook
  const [createPost, { isLoading, error }] = useCreatePostMutation()

  const handleCamera = async () => {
    const uri = await pickFromCamera(MediaTypeOptions.All)
    if (uri) setMedia(m => [...m, uri])
  }

  const handleGallery = async () => {
    const uris = await pickMultipleFromGallery(MediaTypeOptions.All)
    setMedia(m => [...m, ...uris])
  }

  const handleLocation = async () => {
    const loc = await getFormattedLocation()
    if (loc) {
      setLocation(loc)
    } else {
      Alert.alert('Unable to fetch location.')
    }
  }

  const handlePost = async (text: string) => {
    // Build array of “file” objects for FormData
    const files = media.map(uri => {
      const name = uri.split('/').pop() || 'file'
      const isVideo = /\.(mp4|mov|webm)$/i.test(uri)
      return {
        uri,
        name,
        type: isVideo ? 'video/mp4' : 'image/jpeg'
      } as any /* React Native FormData uses this shape */
    })

    try {
      await createPost({
        content: text,
        location: location || undefined,
        media: files,
      }).unwrap()

      // Success → reset form
      Alert.alert('Posted!', 'Your post was uploaded.')
      Toast.show({ type: "success", text1: "Your post was uploaded." })
      setMedia([])
      setLocation(null)
      router.replace('/root/feed')
    } catch (error: any) {
      const err = error?.data?.message || "Fail to post"
      Toast.show({ type: "error", text1: err })
    }
  }

  const handleRemove = (idx: number) => {
    setMedia(m => m.filter((_, i) => i !== idx))
  }

  return (
    <WithLayout headerBgColor={theme.colors.primary}>
      <StatusBar backgroundColor={theme.colors.primary} animated barStyle={'dark-content'} />
      <View style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {error ? (
            <Text style={styles.errorText}>
              {typeof error === 'string' ? error : 'An error occurred.'}
            </Text>
          ) : null}

          <PostComposer
            onPost={handlePost}
            onCameraTap={handleCamera}
            onGalleryTap={handleGallery}
            onLocationTap={handleLocation}
            mediaUris={media}
            location={location}
            isPosting={isLoading}
          />

          {media.length > 0 && (
            <MediaCarousel uris={media} onRemove={handleRemove} />
          )}

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}
        </ScrollView>
      </View>
    </WithLayout>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  scroll: {
    paddingBottom: 32,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 8,
  },
})
