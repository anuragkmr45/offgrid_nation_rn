// utils/imagePicker.ts

import * as ImagePicker from 'expo-image-picker'
import { Alert, Linking } from 'react-native'

export type MediaTypeOption =
  | ImagePicker.MediaTypeOptions.Images
  | ImagePicker.MediaTypeOptions.Videos
  | ImagePicker.MediaTypeOptions.All

/**
 * Launch camera to take a single photo or video.
 * @param mediaTypes – one of ImagePicker.MediaTypeOptions
 * @returns URI of the captured media or null
 */
export async function pickFromCamera(
  mediaTypes: MediaTypeOption = ImagePicker.MediaTypeOptions.Images,
): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync()
  if (status !== ImagePicker.PermissionStatus.GRANTED) {
    Alert.alert(
      'Camera Permission',
      'Please enable camera access in Settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Settings', onPress: () => Linking.openSettings() },
      ],
    )
    return null
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes,
    quality: 0.8,
  })

  if (result.canceled) {
    return null
  }

  // result.assets is a non-empty array when not canceled
  return result.assets[0].uri
}

/**
 * Pick a single item from the library (image or video).
 * @param mediaTypes – one of ImagePicker.MediaTypeOptions
 * @returns URI or null
 */
export async function pickFromGallery(
  mediaTypes: MediaTypeOption = ImagePicker.MediaTypeOptions.Images,
): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (status !== ImagePicker.PermissionStatus.GRANTED) {
    Alert.alert(
      'Media Library Permission',
      'Please enable photo & video access in Settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Settings', onPress: () => Linking.openSettings() },
      ],
    )
    return null
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes,
    allowsMultipleSelection: false,
    quality: 0.8,
  })

  if (result.canceled) {
    return null
  }
  return result.assets[0].uri
}

/**
 * Pick multiple items from the library (images and/or videos).
 * @param mediaTypes – one of ImagePicker.MediaTypeOptions
 * @returns Array of URIs
 */
export async function pickMultipleFromGallery(
  mediaTypes: MediaTypeOption = ImagePicker.MediaTypeOptions.Images,
): Promise<string[]> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (status !== ImagePicker.PermissionStatus.GRANTED) {
    Alert.alert(
      'Media Library Permission',
      'Please enable photo & video access in Settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Settings', onPress: () => Linking.openSettings() },
      ],
    )
    return []
  }

  // Expo SDK ≥48: supports pickMultipleMediaAsync
  if (typeof (ImagePicker as any).pickMultipleMediaAsync === 'function') {
    // @ts-ignore
    const multi = await (ImagePicker as any).pickMultipleMediaAsync({
      mediaTypes,
      quality: 0.8,
    }) as { canceled: boolean; assets: Array<{ uri: string }> }

    if (multi.canceled) return []
    return multi.assets.map(asset => asset.uri)
  }

  // Fallback: single-selection multiple times (or just once)
  const single = await ImagePicker.launchImageLibraryAsync({
    mediaTypes,
    allowsMultipleSelection: true,
    quality: 0.8,
  })

  if (single.canceled) return []
  // if SDK doesn't truly allow multiple, we still get assets array
  return single.assets.map(asset => asset.uri)
}
