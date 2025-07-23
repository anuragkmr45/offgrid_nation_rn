// // components/chat/ConversationScreen.tsx

import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Loader } from '../common';
import { ChatInputBar } from './ChatInputBar';
import { ConversationHeader } from './ConversationHeader';
import { MessageBubble } from './MessageBubble';

import { AVATAR_FALLBACK } from '@/constants/AppConstants';
import {
  chatApi,
  useGetMessagesByConversationQuery,
  useGetMessagesByRecipientQuery,
  useMarkReadMutation,
  useSendMessageMutation,
} from '@/features/chat/api/chatApi';
import { useAppSelector } from '@/store/hooks';
import { SharedPostBubble } from './SharedPostBubble';

interface ConversationScreenProps {
  chatId: string; // recipient user ID
  avatarUrl?: string;
  name?: string;
}

export const ConversationScreen: React.FC<ConversationScreenProps> = ({ chatId, avatarUrl, name }) => {
  const router = useRouter();
  const userId = useAppSelector(state => state.auth.user?._id);

  const [conversationId, setConversationId] = useState<string>('');
  const [historicalMessages, setHistoricalMessages] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const [triggerGetMessagesByRecipient] = chatApi.endpoints.getMessagesByRecipient.useLazyQuery();

  const { data: history = [], isLoading: historyLoading } = useGetMessagesByRecipientQuery(
    { recipientId: chatId, limit: 20 },
    { skip: !!conversationId }
  );

  useEffect(() => {
    if (!conversationId && history.length > 0) {
      setConversationId(history[0].conversationId);
    }
  }, [history, conversationId]);

  const { data: realtime = [], isLoading: rtLoading } = useGetMessagesByConversationQuery(
    { conversationId: conversationId!, cursor: "", limit: 20 },
    { skip: !conversationId }
  );

  const messages = conversationId ? realtime : history;
  const loading = conversationId ? rtLoading : historyLoading;

  const [markRead] = useMarkReadMutation();
  const didMarkRef = useRef(false);
  useEffect(() => {
    if (conversationId && !didMarkRef.current) {
      markRead(conversationId);
      didMarkRef.current = true;
    }
  }, [conversationId, markRead]);

  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const handleSend = useCallback(
    async (text: string) => {
      try {
        if (conversationId) {
          await sendMessage({ recipient: chatId, actionType: 'text', text, conversationId }).unwrap();
        } else {
          const result = await sendMessage({ recipient: chatId, actionType: 'text', text }).unwrap();
          setConversationId(result.conversationId);
        }
      } catch (err: any) {
        Toast.show({ type: 'error', text1: err.data?.message || 'Unable to send message' });
      }
    },
    [chatId, conversationId, sendMessage]
  );

  // Merge and deduplicate messages
  const combinedMessagesMap = new Map<string, any>();
  const combinedMessages = useMemo(() => {
    [...messages, ...historicalMessages].forEach(msg =>
      combinedMessagesMap.set(msg._id, msg)
    );
    return Array.from(combinedMessagesMap.values()).sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
  }, [messages, historicalMessages]);

  return (
    <View style={styles.container}>
      <ConversationHeader
        avatarUrl={avatarUrl || AVATAR_FALLBACK}
        name={name || 'Chat'}
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView style={{ flex: 1 }}>
        {loading && <Loader />}

        {!loading && combinedMessages.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Start a conversation…</Text>
          </View>
        )}

        <FlatList
          data={combinedMessages}
          inverted
          onEndReachedThreshold={0.02}
          keyExtractor={(m) => m._id}
          renderItem={({ item }) => {
            const { sender, sentAt, actionType, postPayload, text } = item || {}
            const senderId = typeof sender === 'string' ? sender : sender?._id;
            const outgoing = senderId === userId;
            const timestamp = new Date(sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (actionType === 'post') {
              return <SharedPostBubble post={postPayload} timestamp={timestamp} outgoing={outgoing} />;
            }
            return <MessageBubble text={text || ''} timestamp={timestamp} outgoing={outgoing} />;
          }}
          contentContainerStyle={styles.messages}
          onEndReached={async () => {
            if (combinedMessages.length === 0) return;
            if (loadingMore || !hasMore) return;
            const oldest = combinedMessages[combinedMessages.length - 1];
            if (!oldest?.sentAt) return;

            const nextCursor = oldest.sentAt;

            try {
              setLoadingMore(true);
              const result = await triggerGetMessagesByRecipient({
                recipientId: chatId,
                limit: PAGE_SIZE,
                cursor: nextCursor,
              }).unwrap();
              setHistoricalMessages(prev => [...prev, ...result]);
              setCursor(nextCursor);
              if (result.length) {
                setHistoricalMessages(prev => [...prev, ...result]);
              }

              // if fewer than a full page arrived → no more data
              if (result.length < PAGE_SIZE) {
                setHasMore(false);
              }
            } catch (error: any) {
              Toast.show({ type: 'error', text1: 'Failed to load more messages' });
            } finally {
              setLoadingMore(false);
            }
          }}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loaderContainer}>
                <Loader />
              </View>
            ) : null
          }
        />

        <ChatInputBar onSend={handleSend} loading={sending} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.background, flex: 1 },
  messages: { padding: 12 },
  empty: { paddingTop: 24, alignItems: 'center' },
  emptyText: { color: theme.colors.textSecondary, fontSize: 14 },
  loaderContainer: { paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
});
