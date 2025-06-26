// src/screens/FeedScreen.tsx
import { PostCard, PostType } from '@/components/common/feeds/PostCard';
import { WithLayout } from '@/components/layouts/WithLayout';
import { theme } from '@/constants/theme';
import { useFeed } from '@/features/content/feed/hooks/useFeed';
import type { FeedPost } from '@/features/content/feed/types';
import { TAB_EVENTS, TabEventEmitter } from '@/utils/TabEventEmitter';
import { timeAgo } from '@/utils/timeAgo';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

export default function FeedScreen() {
  const { posts, isLoading, isFetching, refetch, hasMore, fetchNext } = useFeed();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const listener = () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      setTimeout(() => {
        refetch();
      }, 500);
    };

    TabEventEmitter.on(TAB_EVENTS.HOME_DOUBLE_TAP, listener); // ✅ NEW

    return () => {
      TabEventEmitter.off(TAB_EVENTS.HOME_DOUBLE_TAP, listener); // ✅ NEW
    };
  }, [refetch]);

  // tell TS that renderItem works on FeedPost
  const renderItem: ListRenderItem<FeedPost> = useCallback(
    ({ item }) => {
      const post: PostType = {
        postId: item._id,
        user: {
          avatar: item.userId.profilePicture,
          username: item.userId.username,
        },
        timestamp: timeAgo(item.createdAt),
        media: item.media.map((url, i) => ({ id: `${item._id}-${i}`, url })),
        caption: item.content,
        isLiked: item.isLiked,
        commentsCount: item.commentsCount,
        likesCount: item.likesCount,
      };
      return <PostCard post={post} />;
    },
    []
  );

  return (
    <WithLayout>
      <FlatList<FeedPost>
        contentContainerStyle={styles.container}
        data={posts}
        renderItem={renderItem}
        ref={flatListRef}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={() => {
          if (!isLoading && hasMore) fetchNext();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : null
        }
        ListFooterComponentStyle={{ paddingBottom: 16 }}
      />
      <View style={{ marginBottom: 30 }} />
    </WithLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  loader: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
