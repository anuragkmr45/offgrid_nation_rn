import { theme } from '@/constants/theme'
import React, { useState } from 'react'
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { PostMedia } from '../common/feeds/PostMedia'
import { PostPreviewModal } from '../modals/PostPreviewModal'

interface Post {
  id: string
  media: string[]
  content: string
}

interface Props {
  data: Post[]
  onPostPress: (id: string) => void
}

export const PostsGrid: React.FC<Props> = ({ data, onPostPress }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  if (!data.length) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
        <Text style={styles.empty}>No posts yet.</Text>
      </View>
    )
  }

  const numCols = 2
  const size = (Dimensions.get('window').width - 48) / numCols

  const openModal = (post: Post) => {
    setSelectedPost(post)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedPost(null)
  }
  console.log(data);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id?.toString() || `fallback-key-${index}`}
        numColumns={numCols}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const hasMedia = item.media?.length > 0 && typeof item.media[0] === 'string'

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => openModal(item)}
              activeOpacity={0.8}
            >
              {hasMedia ? (
                <PostMedia
                  mediaUrl={item.media[0]}
                  isActive={false}
                  style={[styles.image, { width: size, height: size }]}
                />
              ) : (
                <View
                  style={[
                    styles.textOnlyPlaceholder,
                    { width: size, height: size },
                  ]}
                >
                  <Text style={styles.caption}>
                    {item.content || 'No content'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )
        }}

      />
      <PostPreviewModal
        visible={modalVisible}
        onClose={closeModal}
        post={selectedPost}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  empty: {
    textAlign: 'center',
    marginTop: 32,
    color: theme.colors.textSecondary,
  },
  grid: {
    paddingHorizontal: 16,
  },
  card: {
    margin: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  image: {
    borderRadius: theme.borderRadius,
    resizeMode: 'cover',
  },
  caption: {
    marginTop: 6,
    color: theme.colors.background,
    fontSize: 14,
    flexWrap: 'wrap',
    fontWeight: '500',
  },
  textOnlyPlaceholder: {
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
})
