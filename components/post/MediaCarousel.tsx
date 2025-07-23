// components/post/MediaCarousel.tsx

import { POST_MEDIA_HEIGHT, POST_MEDIA_WIDTH } from '@/constants/AppConstants'
import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { ResizeMode, Video } from 'expo-av'
import React, { useState } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { CustomModal } from '../common'

export interface MediaCarouselProps {
  uris: string[]
  onRemove: (index: number) => void
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  uris,
  onRemove,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUri, setSelectedUri] = useState<string | null>(null)

  const numColumns = 2
  const margin = 8
  const screenW = Dimensions.get('window').width
  const itemSize = (screenW - margin * (numColumns + 1)) / numColumns

  return (
    <View style={styles.gridContainer}>
      {uris.map((uri, idx) => {
        const isVideo = /\.(mp4|mov|webm)$/i.test(uri.toLowerCase())
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSelectedUri(uri)
              setModalVisible(true)
            }}
            key={idx}
            style={{
              width: itemSize,
              height: itemSize,
              marginLeft: margin,
              marginTop: margin,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#f0f0f0',
            }}
          >
            {isVideo ? (
              <Video
                source={{ uri }}
                style={styles.media}
                useNativeControls
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <Image source={{ uri }} style={styles.media} />
            )}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(idx)}
            >
              <Ionicons name="close-circle" size={28} color="rgba(0,0,0,0.6)" />
            </TouchableOpacity>
          </TouchableOpacity>
        )
      })}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        style={{ width: POST_MEDIA_WIDTH, padding: 0,height: POST_MEDIA_HEIGHT+20  }}
      >
        {selectedUri && (
          /\.(mp4|mov|webm)$/i.test(selectedUri) ? (
            <Video
              source={{ uri: selectedUri }}
              style={{
                width: POST_MEDIA_WIDTH,
                height: POST_MEDIA_HEIGHT,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.textSecondary,
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
            />
          ) : (
            <Image
              source={{ uri: selectedUri }}
              style={{
                width: POST_MEDIA_WIDTH,
                height: POST_MEDIA_HEIGHT,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.textSecondary,
              }}
              resizeMode="contain"
            />
          )
        )}
      </CustomModal>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  slide: {
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 8,
  },
})
