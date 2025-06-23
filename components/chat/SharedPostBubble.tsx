// components/chat/SharedPostBubble.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

export interface SharedPostBubbleProps {
  post: {
    userId: { fullName: string; profilePicture: string };
    media: string[];
    content: string;
  };
  timestamp: string;
  outgoing?: boolean;
}

export const SharedPostBubble: React.FC<SharedPostBubbleProps> = ({ post, timestamp, outgoing = false }) => {
  const containerStyle = outgoing ? styles.bubbleOutgoing : styles.bubbleIncoming;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Image source={{ uri: post.userId.profilePicture }} style={styles.avatar} />
        <Text style={styles.name}>{post.userId.fullName}</Text>
      </View>

      {post.media.length > 0 && (
        <Image source={{ uri: post.media[0] }} style={styles.media} resizeMode="cover" />
      )}

      <Text style={styles.content}>{post.content}</Text>
      <Text style={styles.time}>{timestamp}</Text>
    </View>
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
  media: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 6,
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
});
