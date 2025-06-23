// components/premium/PremiumPostWidget.tsx

import { CommentModal } from '@/components/modals/CommentModal'
import { theme } from '@/constants/theme'
import { usePost } from '@/features/content/post/hooks/usePost'
import { timeAgo } from '@/utils/timeAgo'
import { ResizeMode, Video } from 'expo-av'
import React, { useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native'

// Icon URIs
const likeIcon = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/post-like-icon_tk5wtx.png' }
const dislikeIcon = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/post-dislike-icon_wfnpoq.png' }
const commentIcon = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/comment-icon_tpavcd.png' }

export interface PremiumFeedPost {
  _id: string
  media: string[]
  commentsCount: number
  likesCount: number
  isLiked: boolean
  createdAt: string
  content?: string
}

interface Props {
  post: PremiumFeedPost
  onProfileTap: () => void
}

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window')
const CARD_HEIGHT = SCREEN_HEIGHT * 0.4
const MEDIA_WIDTH = width - 24
const MEDIA_HEIGHT = (MEDIA_WIDTH * 16) / 16

export const PremiumPostWidget: React.FC<Props> = ({ post, onProfileTap }) => {
  const { likePost } = usePost()
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likesCount)
  const [isCommentVisible, setCommentVisible] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current
  const [visibleIndex, setVisibleIndex] = useState(0)

  const toggleLike = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start()
    try {
      const res = await likePost({ postId: post._id }).unwrap()
      setIsLiked(res.isLiked)
      setLikeCount(res.likesCount)
    } catch {}
  }

  const onViewableItemsChanged = useRef<
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void
  >(({ viewableItems }) => {
    if (viewableItems.length) setVisibleIndex(viewableItems[0].index ?? 0)
  }).current
  const viewConfig = useRef({ itemVisiblePercentThreshold: 50 }).current

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity onPress={onProfileTap} style={styles.header}>
        {/* replace with dynamic avatar if available */}
        <Image source={{ uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1749901306/fr-bg-white_hea7pb.png' }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>OFFGRID NATION</Text>
          <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
        </View>
      </TouchableOpacity>

      {/* Media */}
      {post.media.length > 0 && (
        <FlatList
          data={post.media}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, idx) => `${post._id}-${idx}`}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfig}
          renderItem={({ item, index }) => {
            const isVideo = item.includes('/posts/video/')
            return (
              <View style={{ width: MEDIA_WIDTH, height: MEDIA_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
                {isVideo ? (
                  <Video
                    source={{ uri: item }}
                    style={styles.media}
                    resizeMode={ResizeMode.COVER}
                    useNativeControls={false}
                    shouldPlay={index === visibleIndex}
                    isLooping
                  />
                ) : (
                  <Image source={{ uri: item }} style={styles.media} />
                )}
              </View>
            )
          }}
          style={styles.carousel}
        />
      )}

      {/* Caption */}
      {post.content && <Text style={styles.contentText}>{post.content}</Text>}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={toggleLike}>  
          <Animated.Image source={isLiked ? likeIcon : dislikeIcon} style={[styles.icon, { transform: [{ scale: scaleAnim }] }]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCommentVisible(true)}>
          <Image source={commentIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statsText}>{likeCount} likes</Text>
        <Text style={styles.statsText}>{post.commentsCount} comments</Text>
      </View>

      {/* Comment Modal */}
      <CommentModal postId={post._id} visible={isCommentVisible} onClose={() => setCommentVisible(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#Fbbc06',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: 'bold', color: 'black' },
  timestamp: { fontSize: 12, color: 'black' },
  carousel: { marginBottom: 8 },
  media: { width: '100%', height: '100%', borderRadius: theme.borderRadius },
  contentText: { fontSize: 14, color: 'black', marginBottom: 8 },
  actions: { flexDirection: 'row', marginBottom: 4 },
  icon: { width: 24, height: 24, marginRight: 16 },
  stats: { flexDirection: 'row', marginLeft: 8 },
  statsText: { fontSize: 13, color: 'black', marginRight: 12 },
})
