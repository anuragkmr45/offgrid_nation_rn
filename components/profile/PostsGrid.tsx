// components/post/PostsGrid.tsx

import { PostCard, PostType } from '@/components/common/feeds/PostCard';
import { theme } from '@/constants/theme';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  ViewStyle, ViewToken
} from 'react-native';

interface Post {
  _id: string
  media: string[]
  content: string
  commentsCount: number
  likesCount: number
  isLiked: boolean
  userId: { profilePicture: string; username: string }
  createdAt: string
}

interface Props {
  data: Post[]
  loadingMore?: boolean
  hasMore?: boolean
  onEndReached?: () => void
  containerStyle?: ViewStyle
  username: string
  avatarUrl: string
}

export const PostsGrid: React.FC<Props> = ({
  data,
  loadingMore,
  hasMore = false,
  onEndReached,
  containerStyle,
  username,
  avatarUrl
}) => {
  const [visibleIds, setVisibleIds] = useState<string[]>([])

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const ids = viewableItems.map((v) => v.item._id)
    setVisibleIds(ids)
  }).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  const renderItem = ({ item }: { item: Post }) => {
    const isVisible = visibleIds.includes(item._id);
    // shape it into your PostType for PostCard
    const post: PostType = {
      postId: item._id,
      user: {
        avatar: avatarUrl,
        username: username,
      },
      timestamp: new Date(item.createdAt).toLocaleString(), // or your timeAgo util
      media: item.media.map((url, i) => ({ id: `${item._id}-${i}`, url })),
      caption: item.content,
      isLiked: item.isLiked,
      commentsCount: item.commentsCount,
      likesCount: item.likesCount,
    }

    return (
      <PostCard post={post} isVisible={isVisible} />
    )
  }

  return (
    <FlatList
      style={[styles.list, containerStyle]}
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      onEndReached={() => {
        if (hasMore && onEndReached) onEndReached()
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        hasMore ? (
          <View style={styles.loader}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : null
      } onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
  },
  loader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
})
