// components/common/PostCard.tsx

import { BottomSheet } from '@/components/common/BottomSheet'
import { CommentModal } from '@/components/modals/CommentModal'
import { ShareModal } from '@/components/modals/ShareModal'
import { AVATAR_FALLBACK, COMMENT_ICON, DISLIKE_ICON, LIKE_ICON, SHARE_ICON } from '@/constants/AppConstants'
import { theme } from '@/constants/theme'
import { usePost } from '@/features/content/post/hooks/usePost'
import { debounce } from '@/utils/debounce'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewToken
} from 'react-native'
import Toast from 'react-native-toast-message'
import WebView from 'react-native-webview'
import { PostMedia } from './PostMedia'

// Icons
const likeIcon = { uri: LIKE_ICON }
const dislikeIcon = { uri: DISLIKE_ICON }
const commentIcon = { uri: COMMENT_ICON }
const shareIcon = { uri: SHARE_ICON }

const urlRegex = /(https?:\/\/[^\s]+)/g

// Types
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

interface PostCardProps {
  post: PostType
  isVisible?: boolean
  cardHeight?: number
  cardWidth?: number
}

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window')
const CARD_HEIGHT = SCREEN_HEIGHT * 0.8
const MEDIA_WIDTH = width - 32
const MEDIA_HEIGHT = (MEDIA_WIDTH * 16) / 9

const renderWithLinks = (raw: string) =>
  raw.split(urlRegex).map((part, idx) => {
    const isLink = /^https?:\/\//i.test(part)
    if (isLink) {
      return (
        <Text
          key={idx}
          style={styles.linkText}
          onPress={() => Linking.openURL(part)}>
          {part}
        </Text>
      )
    }
    return <Text key={idx}>{part}</Text>
  })

export const PostCard: React.FC<PostCardProps> = ({ post, isVisible = true, cardHeight, cardWidth }) => {
  const router = useRouter()
  const { likePost, reportPostOrComment, reportStatus } = usePost()

  const resolvedHeight = cardHeight ?? CARD_HEIGHT
  const resolvedWidth = cardWidth ?? MEDIA_WIDTH

  const [isLike, setIsLike] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likesCount)
  const [isCommentVisible, setCommentVisible] = useState(false)
  const [isShareVisible, setShareVisible] = useState(false)
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current

  const [visibleIndex, setVisibleIndex] = useState(0)
  const CAPTION_LIMIT = 42
  const isCaptionLong = post.caption.length > CAPTION_LIMIT
  const displayedCaption = isCaptionExpanded ? post.caption : post.caption.slice(0, CAPTION_LIMIT)

  // Report sheet
  const [reportSheetVisible, setReportSheetVisible] = useState(false)
  const [reportReason, setReportReason] = useState('')

  useEffect(() => { setIsLike(post.isLiked) }, [post.isLiked])
  useEffect(() => { setLikeCount(post.likesCount) }, [post.likesCount])

  const hasOnlyLink =
    post.media.length === 0 &&
    post.caption.trim().match(urlRegex)?.[0] === post.caption.trim()

  const toggleLike = useCallback(async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start()
    setIsLike(prevLike => {
      const nextLike = !prevLike
      setLikeCount(prevCount => prevCount + (nextLike ? 1 : -1))
      return nextLike
    })
    try {
      await likePost({ postId: post.postId }).unwrap()
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Unable to like this post'
      Toast.show({ type: "error", text1: errorMessage })
    }
  }, [likePost, post.postId, scaleAnim])

  const debouncedToggleLike = useMemo(() => debounce(toggleLike, 500), [toggleLike])

  const onViewableItemsChanged = useRef<(
    info: { viewableItems: ViewToken[]; changed: ViewToken[] }
  ) => void>(({
    viewableItems,
  }) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index ?? 0)
    }
  }).current

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current

  const containerStyle = post.media.length > 0
    ? [styles.card, { height: resolvedHeight }]
    : styles.card

  useEffect(() => {
    return () => {
      debouncedToggleLike.cancel()
    }
  }, [debouncedToggleLike])

  const openReportSheet = () => setReportSheetVisible(true)
  const closeReportSheet = () => setReportSheetVisible(false)

  const  submitReport = async () => {
    const reason = reportReason.trim()
    if (!reason) {
      Toast.show({ type: 'info', text1: 'Please describe the issue' })
      return
    }
    try {
      await reportPostOrComment({ postId: post.postId, commentId: '', reason }).unwrap()
      Toast.show({ type: 'success', text1: 'Thanks for your report' })
      setReportReason('')
      closeReportSheet()
    } catch (e: any) {
      Toast.show({ type: 'error', text1: e?.data?.message || 'Failed to submit report' })
    }
  }

  return (
    <View style={containerStyle}>
      <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
        <TouchableOpacity style={styles.header} onPress={() => router.push(`/root/profile/${post.user.username}`)}>
          <Image source={{ uri: post.user.avatar ?? AVATAR_FALLBACK }} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.username}>{post.user.username ?? ""}</Text>
            <Text style={styles.timestamp}>{post.timestamp ?? ""}</Text>
          </View>
        </TouchableOpacity>

        {/* 3-dot icon that opens Report Bottom Sheet directly */}
        <TouchableOpacity
          style={[styles.header, styles.headerRight]}
          onPress={openReportSheet}
          accessibilityLabel="Report post"
        >
          <Ionicons name="flag-outline" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

      </View>

      {post?.media?.length > 0 ? (
        <FlatList
          data={post?.media}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item, index }) => (
            <View style={[styles.mediaContainer, { width: resolvedWidth, height: MEDIA_HEIGHT }]}>
              <PostMedia
                mediaUrl={item.url ?? AVATAR_FALLBACK}
                isActive={isVisible && index === visibleIndex}
                style={[styles.media, { width: resolvedWidth, height: MEDIA_HEIGHT }]}
              />
            </View>
          )}
          style={styles.carousel}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      ) : hasOnlyLink ? (
        <View>
          <WebView
            source={{ uri: post.caption.trim().match(urlRegex)?.[0] ?? '' }}
            style={{
              width: resolvedWidth,
              height: MEDIA_HEIGHT / 1.4,
              marginHorizontal: 16,
              borderRadius: theme.borderRadius,
              overflow: 'hidden',
            }}
            javaScriptEnabled
            domStorageEnabled
          />
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            <Text style={styles.caption}>
              {renderWithLinks(displayedCaption)}
              {!isCaptionExpanded && isCaptionLong ? '...' : ''}
            </Text>
            {isCaptionLong && (
              <TouchableOpacity onPress={() => setIsCaptionExpanded(prev => !prev)}>
                <Text style={styles.toggleText}>
                  {isCaptionExpanded ? 'Read less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.textOnlyContainer}>
          <Text style={styles.textOnly}>{post.caption}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={debouncedToggleLike} style={styles.actionButton}>
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
          <Text style={styles.caption}>
            {renderWithLinks(displayedCaption)}
            {!isCaptionExpanded && isCaptionLong ? '...' : ''}
          </Text>
          {isCaptionLong && (
            <TouchableOpacity onPress={() => setIsCaptionExpanded(prev => !prev)}>
              <Text style={styles.toggleText}>
                {isCaptionExpanded ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Report Bottom Sheet */}
      <BottomSheet visible={reportSheetVisible} onClose={closeReportSheet} height="45%">
        <View style={{ paddingTop: 6, paddingBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>Report post</Text>
          <Text style={{ marginTop: 6, color: theme.colors.textSecondary }}>
            Tell us what’s wrong. Example: “Sexual content”, “Spam”, “Hate speech”, etc.
          </Text>
        </View>

        <TextInput
          value={reportReason}
          onChangeText={setReportReason}
          placeholder="Describe the issue…"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.reportInput}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.sheetButtons}>
          <TouchableOpacity style={[styles.sheetBtn, styles.cancelBtn]} onPress={closeReportSheet}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sheetBtn, styles.submitBtn]}
            onPress={submitReport}
            disabled={reportStatus.isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>{reportStatus.isLoading ? 'Submitting…' : 'Submit'}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      <CommentModal postId={post.postId} visible={isCommentVisible} onClose={() => setCommentVisible(false)} />
      <ShareModal visible={isShareVisible} onClose={() => setShareVisible(false)} mediaUrl={post.media[0]?.url || ''} content={post.caption} postId={post.postId} />
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
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  headerRight: { paddingVertical: 16, paddingHorizontal: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.textSecondary,
  },
  headerText: { marginLeft: 12 },
  username: {
    fontSize: theme.fontSizes.titleMedium,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  timestamp: {
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  textOnlyContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: theme.borderRadius,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  textOnly: {
    fontSize: theme.fontSizes.bodyLarge,
    color: theme.colors.textPrimary,
  },
  linkOnlyContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#eef6ff',
    borderRadius: theme.borderRadius,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    fontSize: theme.fontSizes.bodyLarge,
  },
  carousel: { marginBottom: 12 },
  mediaContainer: { justifyContent: 'center', alignItems: 'center' },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius,
  },
  footer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  actionButton: { marginRight: 20, flexDirection: 'row' },
  actionIcon: { width: 20, height: 20, marginRight: 4 },
  caption: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    fontSize: theme.fontSizes.bodyLarge,
    lineHeight: 20,
    color: theme.colors.textPrimary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 4,
  },

  // Report sheet styles
  reportInput: {
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
  },
  sheetButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
  },
  sheetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: theme.colors.textSecondary + '22',
  },
  cancelText: {
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
  },
  submitText: {
    color: theme.colors.background,
    fontWeight: '700',
  },
})
