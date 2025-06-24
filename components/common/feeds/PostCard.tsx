// components/common/PostCard.tsx

import { CommentModal } from '@/components/modals/CommentModal'
import { ShareModal } from '@/components/modals/ShareModal'
import { theme } from '@/constants/theme'
import { usePost } from '@/features/content/post/hooks/usePost'
import { ResizeMode, Video } from 'expo-av'
import { useRouter } from 'expo-router'
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
const shareIcon = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/share-icon_ij6xgh.png' }

// A real fallback image
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1617196034447-2e532ebb4cc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'

// ——— Data Shapes ———
export interface MediaItem { id: string; url: string }
export interface PostType {
  postId: string
  user: { avatar: string; username: string }
  timestamp: string
  media: MediaItem[]
  caption: string
  isLiked: boolean
  commentsCount: number
  likesCount: number
}

interface PostCardProps { post: PostType }

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window')
const CARD_HEIGHT = SCREEN_HEIGHT * 0.8
const MEDIA_WIDTH = width - 32
const MEDIA_HEIGHT = (MEDIA_WIDTH * 16) / 9

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const router = useRouter()
  const { likePost } = usePost()

  const [isLike, setIsLike] = useState(post.isLiked)
  const scaleAnim = useRef(new Animated.Value(1)).current
  const [isCommentVisible, setCommentVisible] = useState(false)
  const [isShareVisible, setShareVisible] = useState(false)
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)
  const [visibleIndex, setVisibleIndex] = useState(0)
  const CAPTION_LIMIT = 42
  const isCaptionLong = post.caption.length > CAPTION_LIMIT
  const displayedCaption = isCaptionExpanded ? post.caption : post.caption.slice(0, CAPTION_LIMIT)
  const [likeCount, setLikeCount] = useState(post.likesCount)

  const toggleLike = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start()
    try {
      const response = await likePost({ postId: post.postId }).unwrap()
      setIsLike(response.isLiked)
      setLikeCount(response.likesCount)
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  // Typed viewability callback
  const onViewableItemsChanged = useRef<
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void
  >(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index ?? 0)
    }
  }).current

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current

  const containerStyle = post.media.length > 0
    ? [styles.card, { height: CARD_HEIGHT }]
    : styles.card

  return (
    <View style={containerStyle}>
      <TouchableOpacity style={styles.header} onPress={() => router.push(`/root/profile/${post.user.username}`)}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.username}>{post.user.username}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
      </TouchableOpacity>

      {post.media.length > 0 ? (
        <FlatList
          data={post.media}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item, index }) => {
            const isVideo = item.url.includes('/posts/video/')
            return (
              <View style={[styles.mediaContainer, { width: MEDIA_WIDTH, height: MEDIA_HEIGHT }]}>                
                {isVideo ? (
                  <Video
                    source={{ uri: item.url }}
                    style={styles.media}
                    resizeMode={ResizeMode.COVER}
                    useNativeControls={false}
                    shouldPlay={index === visibleIndex}
                    isLooping
                  />
                ) : (
                  <Image source={{ uri: item.url }} style={styles.media} />
                )}
              </View>
            )
          }}
          style={styles.carousel}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      ) : (
        <View style={styles.textOnlyContainer}>
          <Text style={styles.textOnly}>{post.caption}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
          <Animated.Image source={isLike ? likeIcon : dislikeIcon} style={[styles.actionIcon, { transform: [{ scale: scaleAnim }] }]} />
          <Text>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => setCommentVisible(true)}>
          <Image source={commentIcon} style={styles.actionIcon} />
          <Text>{post.commentsCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShareVisible(true)}>
          <Image source={shareIcon} style={styles.actionIcon} />
        </TouchableOpacity>
      </View>

      {post.media.length > 0 && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Text style={styles.caption}>{displayedCaption}{(!isCaptionExpanded && isCaptionLong) ? '...' : ''}</Text>
          {isCaptionLong && (
            <TouchableOpacity onPress={() => setIsCaptionExpanded(prev => !prev)}>
              <Text style={styles.toggleText}>{isCaptionExpanded ? 'Read less' : 'Read more'}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <CommentModal postId={post.postId} visible={isCommentVisible} onClose={() => setCommentVisible(false)} />
      <ShareModal visible={isShareVisible} onClose={() => setShareVisible(false)} mediaUrl={post.media[0]?.url || ''} content={post.caption} postId={post.postId} />
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.background, borderRadius: theme.borderRadius, overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.textSecondary },
  headerText: { marginLeft: 12 },
  username: { fontSize: theme.fontSizes.titleMedium, fontWeight: '500', color: theme.colors.textPrimary },
  timestamp: { fontSize: theme.fontSizes.bodyMedium, color: theme.colors.textSecondary, marginTop: 2 },
  carousel: { marginBottom: 12 },
  mediaContainer: { justifyContent: 'center', alignItems: 'center' },
  media: { width: '100%', height: '100%', borderRadius: theme.borderRadius },
  textOnlyContainer: { width: '100%', padding: 16, backgroundColor: '#f0f0f0', borderRadius: theme.borderRadius, marginHorizontal: 16, marginBottom: 12 },
  textOnly: { fontSize: theme.fontSizes.bodyLarge, color: theme.colors.textPrimary },
  footer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  actionButton: { marginRight: 20, flexDirection: 'row' },
  actionIcon: { width: 20, height: 20, marginRight: 4 },
  caption: { paddingHorizontal: 16, paddingBottom: 16, fontSize: theme.fontSizes.bodyLarge, lineHeight: 20, color: theme.colors.textPrimary },
  toggleText: { fontSize: 14, fontWeight: '600', color: theme.colors.primary, marginTop: 4 },
})
