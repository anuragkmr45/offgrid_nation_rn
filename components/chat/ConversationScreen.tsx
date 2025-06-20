// components/chat/ConversationScreen.tsx

import { useMarkReadMutation } from '@/features/chat/api/chatApi';
import { useChatMessages } from '@/features/chat/hooks/useChat';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import { theme } from '../../constants/theme';
import { Loader } from '../common';
import { ChatInputBar } from './ChatInputBar';
import { ConversationHeader } from './ConversationHeader';
import { MessageBubble } from './MessageBubble';

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

  // fetch + subscribe
  const { messages, isLoading, sendMessage, sending, loadMore } = useChatMessages(chatId);
  const [markRead] = useMarkReadMutation();
console.log({messages});

  // only clear unread once
  const didMarkRead = useRef(false);
  useEffect(() => {
    if (chatId && !didMarkRead.current) {
      markRead(chatId);
      didMarkRead.current = true;
    }
  }, [chatId]);

  const handleSend = useCallback((text: string) => {
    sendMessage({
      recipient:      chatId,
      actionType:     'text',
      text,
      conversationId: chatId,
    });
  }, [chatId, sendMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <ConversationHeader
        avatarUrl={avatarUrl ?? 'https://i.pravatar.cc/150'}
        name={name || 'Chat'}
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        {isLoading && <Loader />}

        <FlatList
          data={messages}
          inverted
          keyExtractor={m => m._id}
          renderItem={({ item }) => (
            <MessageBubble
              text={item.text || ''}
              timestamp={new Date(item.sentAt).toLocaleTimeString([], {
                hour:   '2-digit',
                minute: '2-digit',
              })}
              outgoing={item.sender._id !== item.recipient._id /* or compare to your userId */}
            />
          )}
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
});
