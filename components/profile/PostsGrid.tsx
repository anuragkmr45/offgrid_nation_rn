// components/profile/PostsGrid.tsx

import { theme } from '@/constants/theme'
import React, { useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
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
    return <View style={{ flex: 1, backgroundColor: theme.colors.primary }}><Text style={styles.empty}>No posts yet.</Text></View>
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <FlatList
        data={data}
        keyExtractor={p => p.id}
        numColumns={numCols}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openModal(item)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: item.media[0] }}
              style={[styles.image, { width: size, height: size }]}
            />
            <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.caption, { width: size }]}>
              {item?.content || ""}
            </Text>
          </TouchableOpacity>
        )}
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
})
