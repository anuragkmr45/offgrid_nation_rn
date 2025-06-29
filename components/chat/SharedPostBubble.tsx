import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/theme';
import { CustomModal } from '../common';
import { PostCard } from '../common/feeds/PostCard';

export interface SharedPostBubbleProps {
  post: {
    _id: string;
    content: string;
    media: string[];
    createdAt: string;
    updatedAt: string;
    commentsCount: number;
    likesCount: number;
    isLiked: boolean;
    isFollowing: boolean;
    userId: {
      _id: string;
      username: string;
      fullName: string;
      profilePicture: string;
    };
  };
  timestamp: string;
  outgoing?: boolean;
}


export const SharedPostBubble: React.FC<SharedPostBubbleProps> = ({ post, timestamp, outgoing = false }) => {
  const containerStyle = outgoing ? styles.bubbleOutgoing : styles.bubbleIncoming;
  const hasMedia = post.media.length > 0;
  const mediaUrl = hasMedia ? post.media[0] : null;
  const isVideo = mediaUrl?.includes('/posts/video/');
  const [isModalVisible, setModalVisible] = useState(false);
  const { width, height } = Dimensions.get('window');

  return (
    <>
      <TouchableOpacity style={[styles.container, containerStyle]} activeOpacity={0.8} onPress={() => setModalVisible(true)}>
        <View style={styles.header}>
          <Image source={{ uri: post.userId.profilePicture }} style={styles.avatar} />
          <Text style={styles.name}>{post.userId.fullName || "offgrid-user"}</Text>
        </View>

        {hasMedia && (
          <View style={styles.mediaContainer}>
            {isVideo ? (
              <Video
                source={{ uri: mediaUrl! }}
                style={styles.media}
                resizeMode={ResizeMode.COVER}
                useNativeControls
                shouldPlay={false}
                isLooping
              />
            ) : (
              <Image source={{ uri: mediaUrl! }} style={styles.media} resizeMode="cover" />
            )}
          </View>
        )}

        <Text style={styles.content}>{post.content}</Text>
        <Text style={styles.time}>{timestamp}</Text>
      </TouchableOpacity>
      <CustomModal visible={isModalVisible} onClose={() => setModalVisible(false)} style={styles.fullscreenContainer}>
        {/* 1️⃣ Close button at top-right */}
        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>

        {/* 2️⃣ Fullscreen PostCard */}
        <PostCard
          post={{
            postId: post._id,
            user: {
              avatar: post.userId.profilePicture,
              username: post.userId.username,
            },
            timestamp,
            media: post.media.map((url, idx) => ({ id: `${idx}`, url })),
            caption: post.content,
            isLiked: post.isLiked,
            commentsCount: post.commentsCount,
            likesCount: post.likesCount,
          }}
          cardHeight={height-120}
          cardWidth={width/1.2}
        />
      </CustomModal>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '75%',
    marginVertical: 4,
    padding: 10,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleIncoming: {
    alignSelf: 'flex-start',
  },
  bubbleOutgoing: {
    alignSelf: 'flex-end',
    backgroundColor: '#D1E8FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  name: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  mediaContainer: {
    // marginTop: 6,
    width: 200,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  content: {
    marginTop: 8,
    color: theme.colors.textPrimary,
  },
  time: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  fullscreenContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 40, // adjust based on safe area
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 28,
  },
});
