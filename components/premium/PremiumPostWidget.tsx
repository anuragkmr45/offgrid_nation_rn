import { MediaCarousel } from '@/components/post/MediaCarousel'
import { timeAgo } from '@/utils/timeAgo'
import React, { useRef } from 'react'
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

// Icon URIs
const likeIcon    = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/post-like-icon_tk5wtx.png' }
const dislikeIcon = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/post-dislike-icon_wfnpoq.png' }
const commentIcon = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/comment-icon_tpavcd.png' }
const shareIcon   = { uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/share-icon_ij6xgh.png' }
const avatarUri   = 'https://res.cloudinary.com/dkwptotbs/image/upload/v1749901306/fr-bg-white_hea7pb.png'

export interface PremiumFeedPost {
  _id: string
  media: string[]
  commentsCount: number
  likesCount: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
  /** optional text caption */
  content?: string
}

interface Props {
  post: PremiumFeedPost
  onLikeTap: () => void
  onCommentTap: () => void
  onShareTap: () => void
  onProfileTap: () => void
}

export const PremiumPostWidget: React.FC<Props> = ({
  post,
  onLikeTap,
  onCommentTap,
  onShareTap,
  onProfileTap,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,   duration: 100, useNativeDriver: true }),
    ]).start()
    onLikeTap()
  }

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity onPress={onProfileTap} style={styles.header}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>OFFGRID NATION</Text>
          <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
        </View>
      </TouchableOpacity>

      {/* Media Carousel */}
      {post.media.length > 0 && (
        <MediaCarousel uris={post.media} onRemove={() => {}} />
      )}

      {/* Optional Content */}
      {post.content != null && (
        <Text style={styles.contentText}>{post.content}</Text>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike}>
          <Animated.Image
            source={post.isLiked ? likeIcon : dislikeIcon}
            style={[styles.icon, { transform: [{ scale: scaleAnim }] }]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onCommentTap}>
          <Image source={commentIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onShareTap}>
          <Image source={shareIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statsText}>{post.likesCount} likes</Text>
        <Text style={styles.statsText}>{post.commentsCount} comments</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#Fbbc06',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    color: 'black',
  },
  timestamp: {
    fontSize: 12,
    color: 'black',
  },
  contentText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  stats: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  statsText: {
    fontSize: 13,
    color: 'black',
    marginRight: 12,
  },
})
