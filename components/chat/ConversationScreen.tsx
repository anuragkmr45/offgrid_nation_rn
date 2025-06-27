// components/chat/ConversationScreen.tsx

import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Loader } from '../common';
import { ChatInputBar } from './ChatInputBar';
import { ConversationHeader } from './ConversationHeader';
import { MessageBubble } from './MessageBubble';
import { SharedPostBubble } from './SharedPostBubble';

import { AVATAR_FALLBACK } from '@/constants/AppConstants';
import {
  useGetMessagesByConversationQuery,
  useGetMessagesByRecipientQuery,
  useMarkReadMutation,
  useSendMessageMutation,
} from '@/features/chat/api/chatApi';
import { useAppSelector } from '@/store/hooks';

interface ConversationScreenProps {
  chatId: string; // recipient user ID
  avatarUrl?: string;
  name?: string;
}

export const ConversationScreen: React.FC<ConversationScreenProps> = ({ chatId, avatarUrl, name }) => {
  const router = useRouter();
  const userId = useAppSelector(state => state.auth.user?._id);

  // Track conversationId (becomes defined after first send or from history)
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  // Historical load until we know conversationId
  const { data: history = [], isLoading: historyLoading } = useGetMessagesByRecipientQuery(
    { recipientId: chatId, limit: 20 },
    { skip: !!conversationId }
  );

  // On history load, pick conversationId from first message
  useEffect(() => {
    if (!conversationId && history.length > 0) {
      setConversationId(history[0].conversationId);
    }
  }, [history, conversationId]);

  // Real-time + paginated once we have a convId
  const { data: realtime = [], isLoading: rtLoading } = useGetMessagesByConversationQuery(
    { conversationId: conversationId!, cursor: "", limit: 20 },
    { skip: !conversationId }
  );

  // Choose data & loading based on convId presence
  const messages = conversationId ? realtime : history;
  const loading = conversationId ? rtLoading : historyLoading;

  // Mark as read once when convId appears
  const [markRead] = useMarkReadMutation();
  const didMarkRef = useRef(false);
  useEffect(() => {
    if (conversationId && !didMarkRef.current) {
      markRead(conversationId);
      didMarkRef.current = true;
    }
  }, [conversationId, markRead]);

  // Sending messages: real-time if convId, else first send
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const handleSend = useCallback(
    async (text: string) => {
      try {
        if (conversationId) {
          // Real-time send
          await sendMessage({ recipient: chatId, actionType: 'text', text, conversationId }).unwrap();
        } else {
          // First message create conv
          const result = await sendMessage({ recipient: chatId, actionType: 'text', text }).unwrap();
          setConversationId(result.conversationId);
        }
      } catch (err: any) {
        Toast.show({ type: 'error', text1: err.data?.message || 'Unable to send message' });
      }
    },
    [chatId, conversationId, sendMessage]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated backgroundColor={theme.colors.background} barStyle="dark-content" />
      <ConversationHeader
        avatarUrl={avatarUrl || AVATAR_FALLBACK}
        name={name || 'Chat'}
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView style={styles.flex}>
        {loading && <Loader />}

        {!loading && messages.length === 0 && (
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
            const timestamp = new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (item.actionType === 'post') {
              return <SharedPostBubble post={item.postPayload} timestamp={timestamp} outgoing={outgoing} />;
            }
            return <MessageBubble text={item.text || ''} timestamp={timestamp} outgoing={outgoing} />;
          }}
          contentContainerStyle={styles.messages}
          onEndReached={() => {
            /* optionally handle pagination: for real-time load more or history older */
          }}
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
  empty: { paddingTop: 24, alignItems: 'center' },
  emptyText: { color: theme.colors.textSecondary, fontSize: 14 },
});
