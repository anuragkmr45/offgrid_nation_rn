// app/add-post/index.tsx

import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import { WithLayout } from '@/components/layouts/WithLayout'
import { MediaCarousel } from '@/components/post/MediaCarousel'
import { PostComposer } from '@/components/post/PostComposer'
import { theme } from '@/constants/theme'
import { useCreatePostMutation } from '@/features/content/post/api/postApi'
import {
  pickFromCamera,
  pickMultipleFromGallery
} from '@/utils/imagePicker'
import { compressImage } from '@/utils/mediaCompressor'
import { MediaTypeOptions } from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
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
    if (media.length >= 5) {
      Toast.show({ type: 'info', text1: 'You can only upload up to 5 items.' });
      return;
    }
    const uri = await pickFromCamera(MediaTypeOptions.All)
    if (uri) setMedia(m => [...m, uri])
  }

  const handleGallery = async () => {
    const uris = await pickMultipleFromGallery(MediaTypeOptions.All)
    setMedia(m => [...m, ...uris])
  }

  // const handleLocation = async () => {
  //   const loc = await getFormattedLocation()
  //   if (loc) {
  //     setLocation(loc)
  //   } else {
  //     Alert.alert('Unable to fetch location.')
  //   }
  // }

  const handlePost = async (text: string) => {
    try {
      // 1) Compress only images before upload:
      const compressedFiles = await Promise.all(
        media.map(async (uri) => {
          // detect video by extension
          const isVideo = /\.(mp4|mov|webm)$/i.test(uri.toLowerCase())

          // if it's an image, run through expo-image-manipulator
          const uploadUri = isVideo
            ? uri
            : await compressImage(uri)

          const name = uploadUri.split('/').pop() || 'file'
          const type = isVideo ? 'video/mp4' : 'image/jpeg'
          return { uri: uploadUri, name, type } as any
        })
      )

      // 2) Build FormData
      const formData = new FormData()
      formData.append('content', text)
      if (location) formData.append('location', location)
      compressedFiles.forEach(f => formData.append('media', f))

      // 3) Make the API call
      await createPost({
        content: text,
        location: location || "",
        media: compressedFiles,
      }).unwrap()

      // 4) Success feedback
      Toast.show({ type: 'success', text1: 'Your post was uploaded.' })
      setMedia([])
      setLocation(null)
      router.replace('/root/feed')
    } catch (err: any) {
      const errMsg = err?.data?.message || 'Failed to post. Please try again.'
      Toast.show({ type: 'error', text1: errMsg })
    }
  }

  const handleRemove = (idx: number) => {
    setMedia(m => m.filter((_, i) => i !== idx))
  }

  return (
    <WithLayout headerBgColor={theme.colors.primary}>
      <StatusBar backgroundColor={theme.colors.primary} animated barStyle={'dark-content'} />
      <ProtectedLayout>
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
              // onLocationTap={handleLocation}
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
      </ProtectedLayout>
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
