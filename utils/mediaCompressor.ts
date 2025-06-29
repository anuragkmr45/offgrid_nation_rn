// utils/mediaCompressor.ts
import * as ImageManipulator from 'expo-image-manipulator'

export async function compressImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1080 } }],                      // scale longest edge
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  )
  return result.uri
}
