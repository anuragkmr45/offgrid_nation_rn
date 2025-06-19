// components/post/MediaCarousel.tsx

import { Ionicons } from '@expo/vector-icons'
import { ResizeMode, Video } from 'expo-av'
import React from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

export interface MediaCarouselProps {
  uris: string[]
  onRemove: (index: number) => void
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  uris,
  onRemove,
}) => {
  const width = Dimensions.get('window').width - 32
  const height = (width * 9) / 16

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const lower = item.toLowerCase()
    const isVideo = /\.(mp4|mov|webm)$/i.test(lower)

    return (
      <View style={[styles.slide, { width, height }]}>
        {isVideo ? (
          <Video
            source={{ uri: item }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            useNativeControls
          />
        ) : (
          <Image source={{ uri: item }} style={styles.media} />
        )}

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(index)}
        >
          <Ionicons
            name="close-circle"
            size={28}
            color="rgba(0,0,0,0.6)"
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <FlatList
      data={uris}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, i) => `${i}`}
      style={styles.container}
      renderItem={renderItem}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  slide: {
    marginHorizontal: 16,
    borderRadius:     8,
    overflow:         'hidden',
  },
  media: {
    width:  '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top:      8,
    right:    8,
  },
})
