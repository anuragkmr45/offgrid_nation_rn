// components/common/PostMedia.tsx

import { isVideo } from '@/utils/mediaHelpers'
import { ResizeMode, Video } from 'expo-av'
import React from 'react'
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

interface PostMediaProps {
  mediaUrl: string
  isActive?: boolean
  style?: StyleProp<ImageStyle | ViewStyle>
  resizeMode?: ResizeMode
}

export const PostMedia: React.FC<PostMediaProps> = ({
  mediaUrl,
  isActive = true,
  style,
  resizeMode = ResizeMode.COVER,
}) => {
  if (isVideo(mediaUrl)) {
    return (
      <Video
        source={{ uri: mediaUrl }}
        style={[styles.media, style as StyleProp<ViewStyle>]}
        resizeMode={resizeMode}
        useNativeControls={false}
        shouldPlay={isActive}
        isMuted={!isActive}
        isLooping
      />
    )
  }

  return (
    <Image
      source={{ uri: mediaUrl }}
      style={[styles.media, style as StyleProp<ImageStyle>]}
      resizeMode="cover"
    />
  )
}

const styles = StyleSheet.create({
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
})
