// // components/chat/ConversationScreen.tsx

import { useMarkReadMutation } from '@/features/chat/api/chatApi';
import { useChatMessages } from '@/features/chat/hooks/useChat';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { theme } from '../../constants/theme';
import { Loader } from '../common';
import { ChatInputBar } from './ChatInputBar';
import { ConversationHeader } from './ConversationHeader';
import { MessageBubble } from './MessageBubble';
import { SharedPostBubble } from './SharedPostBubble';

interface ConversationScreenProps {
  chatId: string;
  avatarUrl?: string;
  name?: string;
}

export const ConversationScreen: React.FC<ConversationScreenProps> = ({
  chatId,
  avatarUrl,
  name,
}) => {
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.user?._id);

  // fetch + subscribe
  const {
    messages,
    isLoading,
    sendMessage,
    sending,
    loadMore,
    setAllMessages, // exposed from useChatMessages for optimistic updates
  } = useChatMessages(chatId);

  const [markRead] = useMarkReadMutation();

  // only clear unread once
  const didMarkRead = useRef(false);
  useEffect(() => {
    if (chatId && !didMarkRead.current) {
      markRead(chatId);
      didMarkRead.current = true;
    }
  }, [chatId]);

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      // 1. Optimistically add message
      const optimisticMessage = {
        _id: `local-${Date.now()}`,
        text: text.trim(),
        sentAt: new Date().toISOString(),
        sender: { _id: userId },
        recipient: { _id: chatId },
        actionType: 'text',
        attachments: [],
        conversationId: chatId,
      };

      setAllMessages((prev: any) => [optimisticMessage, ...prev]);

      // 2. Send to backend
      sendMessage({
        recipient: chatId,
        actionType: 'text',
        text: text.trim(),
        conversationId: chatId,
      });
    },
    [chatId, sendMessage, userId, setAllMessages]
  );

  return (
    <SafeAreaView style={styles.container}>
      <ConversationHeader
        avatarUrl={
          avatarUrl ??
          'https://res.cloudinary.com/dtxm0dakw/image/upload/v1744723246/r3hsrs6dnpr53idcjtc5.png'
        }
        name={name || 'Chat'}
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        {isLoading && <Loader />}

        {!isLoading && messages.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Start a conversation…</Text>
          </View>
        )}

        <FlatList
          data={messages}
          inverted
          keyExtractor={(m) => m._id}
          renderItem={({ item }) => {
            const outgoing = item.sender._id === userId;
            const timestamp = new Date(item.sentAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            if (item.actionType === 'post') {
              return (
                <SharedPostBubble
                  post={item.postPayload}
                  timestamp={timestamp}
                  outgoing={outgoing}
                />
              );
            }

            return (
              <MessageBubble
                text={item.text || ''}
                timestamp={timestamp}
                outgoing={outgoing}
              />
            );
          }}
          contentContainerStyle={styles.messages}
          onEndReached={loadMore}
        />

        <ChatInputBar onSend={handleSend} loading={sending} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  messages: { padding: 12 },
  empty: {
    paddingTop: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});
