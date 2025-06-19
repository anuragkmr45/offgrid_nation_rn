// components/common/MediaCarousel.tsx

import { theme } from '@/constants/theme'
import { ResizeMode, Video } from 'expo-av'
import React, { useRef, useState } from 'react'
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    View
} from 'react-native'

interface MediaCarouselProps {
  mediaUrls: string[]
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({ mediaUrls }) => {
  const { width } = Dimensions.get('window')
  const [index, setIndex] = useState(0)
  const pager = useRef<FlatList<string>>(null)

  const renderItem = ({ item }: { item: string }) => {
    const isVideo = /\.(mp4|mov|webm)$/i.test(item)
    return (
      <View style={[styles.slide, { width }]}>
        {isVideo ? (
          <Video
            source={{ uri: item }}
            style={[styles.media, { width }]}
            resizeMode={ResizeMode.COVER}
            useNativeControls={false}
            shouldPlay={false}
          />
        ) : (
          <Image
            source={{ uri: item }}
            style={[styles.media, { width }]}
            resizeMode="cover"
          />
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={pager}
        data={mediaUrls}
        keyExtractor={(u) => u}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={ev => {
          const i = Math.round(ev.nativeEvent.contentOffset.x / width)
          setIndex(i)
        }}
        renderItem={renderItem}
      />

      {/* Indicators */}
      <View style={styles.indicatorBar}>
        {mediaUrls.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === index ? styles.dotActive : undefined
            ]}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  slide: { height: 340 },
  media: {
    height:      340,
    borderRadius: theme.borderRadius,
  },
  indicatorBar: {
    position:        'absolute',
    bottom:          8,
    left:            0,
    right:           0,
    flexDirection:   'row',
    justifyContent:  'center',
  },
  dot: {
    width:            6,
    height:           6,
    borderRadius:     3,
    backgroundColor:  theme.colors.textSecondary,
    marginHorizontal: 4,
  },
  dotActive: {
    width:            12,
    backgroundColor:  theme.colors.primary,
  },
})
