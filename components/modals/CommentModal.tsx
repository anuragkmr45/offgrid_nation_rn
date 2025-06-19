import { theme } from '@/constants/theme';
import { useComment } from '@/features/content/comment/hooks/useComment';
import { timeAgo } from '@/utils/timeAgo';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';

interface CommentModalProps {
  postId: string
  visible: boolean;
  onClose: () => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({ postId, visible, onClose }) => {
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);

  const {
    addComment,
    addReply,
    comments,
    isLoadingComments,
    commentRefetch,
  } = useComment(postId);

  useEffect(() => {
    if (visible) {
      commentRefetch();
      setReplyToCommentId(null)
    }
  }, [visible]);

  const handleSend = async () => {
    if (!commentText.trim()) return;

    try {
      if (replyToCommentId) {
        await addReply({
          commentId: replyToCommentId,
          data: { content: commentText.trim() },
        }).unwrap();
      } else {
        await addComment({
          postId,
          data: { content: commentText.trim() },
        }).unwrap();
      }

      setCommentText('');
      setReplyToCommentId(null);
      commentRefetch();
    } catch (error) {
      console.error('Failed to send:', error);
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      propagateSwipe
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.handle} />

        {isLoadingComments ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            onRefresh={commentRefetch}
            refreshing={isLoadingComments}
            renderItem={({ item }) => {
              const showAllReplies = expandedComments[item._id] ?? false;
              const repliesToShow = showAllReplies ? item.latestReplies : item.latestReplies?.slice(0, 2);

              return (
                <View style={{ padding: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: item.userId.profilePicture }} style={styles.avatar} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={{ fontWeight: 'bold' }}>{item.userId.fullName || item.userId.username}</Text>
                      <Text>{item.content}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={[styles.timeText, { color: '#999' }]}>{timeAgo(item.createdAt)}</Text>
                        <TouchableOpacity onPress={() => setReplyToCommentId(item._id)}>
                          <Text style={[{ color: theme.colors.primary, marginLeft: 10 }, styles.timeText]}>
                            Add Reply
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {repliesToShow?.map((reply, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 44, marginTop: 8 }}>
                      <Image source={{ uri: reply.profilePicture }} style={styles.replyAvatar} />
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontWeight: '500' }}>{reply.fullName || reply.username}</Text>
                        <Text>{reply.replyContent}</Text>
                      </View>
                    </View>
                  ))}

                  {/* ✅ Only show reply mode indicator under the selected comment */}
                  {replyToCommentId === item._id && (
                    <View style={{ paddingHorizontal: 12, paddingBottom: 4, marginLeft: 44 }}>
                      <Text style={{ fontSize: 12, color: '#999' }}>
                        Replying to this comment
                        <Text
                          style={{ color: theme.colors.primary }}
                          onPress={() => setReplyToCommentId(null)}
                        >
                          {'  '}✕ Cancel
                        </Text>
                      </Text>
                    </View>
                  )}

                  {item.repliesCount > 2 && (
                    <TouchableOpacity onPress={() => toggleReplies(item._id)}>
                      <Text style={{ color: '#007bff', marginTop: 8, marginLeft: 44 }}>
                        {showAllReplies ? 'Hide replies...' : 'Read more replies...'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
        >
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder={
                replyToCommentId
                  ? `Replying to @${comments.find(c => c._id === replyToCommentId)?.userId.username || 'user'}...`
                  : 'Add a comment...'
              }
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    height: '70%',
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  handle: {
    height: 5,
    width: 50,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 3,
  },
  comment: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    padding: 10,
    borderRadius: 8,
  },
  sendButton: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  timeText: {
    fontSize: 12,
    marginTop: 2,
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eee',
  },
});
