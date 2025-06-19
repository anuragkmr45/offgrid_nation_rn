// components/common/PostCard.tsx

import { CommentModal } from '@/components/modals/CommentModal'
import { ShareModal } from '@/components/modals/ShareModal'
import { theme } from '@/constants/theme'
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
} from 'react-native'

// Icon URIs
const likeIcon = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/post-like-icon_tk5wtx.png' }
const dislikeIcon = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/post-dislike-icon_wfnpoq.png' }
const commentIcon = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/comment-icon_tpavcd.png' }
const shareIcon = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/share-icon_ij6xgh.png' }

// A real, direct-link fallback (must end in .jpg/.png)
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1617196034447-2e532ebb4cc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'

// ——— Data Shapes ———
export interface MediaItem { id: string; url: string }
export interface PostType {
  user: { avatar: string; username: string }
  timestamp: string
  media: MediaItem[]
  caption: string
}

interface PostCardProps { post: PostType }

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window')
const CARD_HEIGHT = SCREEN_HEIGHT * 0.8
const MEDIA_WIDTH = width - 32
const MEDIA_HEIGHT = (MEDIA_WIDTH * 16) / 9

/** Standalone component so hooks are valid */
const MediaItemCard: React.FC<{ item: MediaItem }> = ({ item }) => {
  const [errored, setErrored] = useState(false)
  const uri = errored ? FALLBACK_IMAGE : item.url
  const isVideo = /\.(mp4|mov|webm)$/i.test(uri)

  return (
    <View style={[styles.mediaContainer, { width: MEDIA_WIDTH, height: MEDIA_HEIGHT }]}>
      {isVideo ? (
        <Video
          source={{ uri }}
          style={styles.media}
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          shouldPlay={false}
          onError={() => setErrored(true)}
        />
      ) : (
        <Image
          source={{ uri }}
          style={styles.media}
          onError={() => setErrored(true)}
        />
      )}
    </View>
  )
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // -- Like/Dislike state & animation
  const [isLiked, setIsLiked] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current
  const [isCommentVisible, setCommentVisible] = useState(false);
  const [isShareVisible, setShareVisible] = useState(false);

  const toggleLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
    setIsLiked((prev) => !prev)
  }

  return (
    <View style={[styles.card, { height: CARD_HEIGHT }]}>
      {/* ——— Header ——— */}
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.username}>{post.user.username}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
      </View>

      {/* ——— Media Carousel ——— */}
      <FlatList
        data={post.media}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MediaItemCard item={item} />}
        style={styles.carousel}
      />

      {/* ——— Actions Footer ——— */}
      <View style={styles.footer}>
        {/* Like/Dislike toggle button */}
        <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
          <Animated.Image
            source={isLiked ? likeIcon : dislikeIcon}
            style={[styles.actionIcon, { transform: [{ scale: scaleAnim }] }]}
          />
        </TouchableOpacity>

        {/* Comment button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => setCommentVisible(true)}>
          <Image source={commentIcon} style={styles.actionIcon} />
        </TouchableOpacity>

        {/* Share button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => setShareVisible(true)}>
          <Image source={shareIcon} style={styles.actionIcon} />
        </TouchableOpacity>
      </View>

      {/* ——— Caption ——— */}
      <Text style={styles.caption} numberOfLines={3} ellipsizeMode="tail">
        {post.caption}
      </Text>
      <CommentModal visible={isCommentVisible} onClose={() => setCommentVisible(false)} />
      <ShareModal visible={isShareVisible} onClose={() => setShareVisible(false)} />

    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.textSecondary,
  },
  headerText: { marginLeft: 12 },
  username: {
    fontSize: theme.fontSizes.titleMedium,
    fontWeight: "500",
    color: theme.colors.textPrimary,
  },
  timestamp: {
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  carousel: { marginBottom: 12 },
  mediaContainer: { justifyContent: 'center', alignItems: 'center' },
  media: { width: '100%', height: '100%', borderRadius: theme.borderRadius },

  footer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  actionButton: { marginRight: 24 },
  actionIcon: { width: 24, height: 24 },

  caption: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    fontSize: theme.fontSizes.bodyLarge,
    lineHeight: 20,
    color: theme.colors.textPrimary,
  },
})
