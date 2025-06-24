// // components/chat/ConversationScreen.tsx

import { useMarkReadMutation } from '@/features/chat/api/chatApi';
import { useChatMessages } from '@/features/chat/hooks/useChat';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Toast from 'react-native-toast-message';
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

  const {
    messages,
    isLoading,
    sendMessage,
    sending,
    loadMore,
  } = useChatMessages(chatId);
  console.log({ messages });

  const [markRead] = useMarkReadMutation();

  // only clear unread once
  const didMarkRead = useRef(false);
  useEffect(() => {
    if (chatId && !didMarkRead.current) {
      markRead(chatId);
      didMarkRead.current = true;
    }
  }, [chatId]);

  const handleSend = useCallback(async (txt: string) => {
    const payload = {
      recipient: chatId,
      actionType: 'text',
      text: txt,
      // conversationId: chatId,
    };
    console.log({ payload });

    try {
      const result = await sendMessage(payload as any).unwrap();
      console.log('⟵ sendMessage result:', result);
    } catch (err: any) {
      Toast.show({ type: "error", text1: err?.data?.message || "Unable to send msg" })
      console.error('✖ sendMessage failed:', err);
    }
  }, [chatId, sendMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated backgroundColor={theme.colors.background} barStyle={'dark-content'} />
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
      // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      // keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        {isLoading && <Loader />}

        {messages.length === 0 && (
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
