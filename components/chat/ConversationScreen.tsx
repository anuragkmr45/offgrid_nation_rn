// // components/chat/ConversationScreen.tsx

// import { theme } from '@/constants/theme';
// import { chatApi } from '@/features/chat/api/chatApi';
// import { useRouter } from 'expo-router';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { FlatList, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
// import Toast from 'react-native-toast-message';
// import { Loader } from '../common';
// import { ChatInputBar } from './ChatInputBar';
// import { ConversationHeader } from './ConversationHeader';
// import { MessageBubble } from './MessageBubble';
// import { SharedPostBubble } from './SharedPostBubble';

// import { AVATAR_FALLBACK } from '@/constants/AppConstants';
// import {
//   useGetMessagesByConversationQuery,
//   useGetMessagesByRecipientQuery,
//   useMarkReadMutation,
//   useSendMessageMutation,
// } from '@/features/chat/api/chatApi';
// import { useAppSelector } from '@/store/hooks';

// interface ConversationScreenProps {
//   chatId: string; // recipient user ID
//   avatarUrl?: string;
//   name?: string;
// }

// export const ConversationScreen: React.FC<ConversationScreenProps> = ({ chatId, avatarUrl, name }) => {
//   const router = useRouter();
//   const userId = useAppSelector(state => state.auth.user?._id);

//   // Track conversationId (becomes defined after first send or from history)
//   const [conversationId, setConversationId] = useState<string>('');
//   const [historicalMessages, setHistoricalMessages] = useState<any[]>([]);
//   const [cursor, setCursor] = useState<string | undefined>(undefined);

//   // Historical load until we know conversationId
//   const { data: history = [], isLoading: historyLoading } = useGetMessagesByRecipientQuery(
//     { recipientId: chatId, limit: 20 },
//     { skip: !!conversationId }
//   );
//   const [triggerGetMessagesByRecipient] = chatApi.endpoints.getMessagesByRecipient.useLazyQuery();

//   // On history load, pick conversationId from first message
//   useEffect(() => {
//     if (!conversationId && history.length > 0) {
//       setConversationId(history[0].conversationId);
//     }
//   }, [history, conversationId]);

//   // Real-time + paginated once we have a convId
//   const { data: realtime = [], isLoading: rtLoading } = useGetMessagesByConversationQuery(
//     { conversationId: conversationId!, cursor: "", limit: 20 },
//     { skip: !conversationId }
//   );

//   // Choose data & loading based on convId presence
//   const messages = conversationId ? realtime : history;
//   const loading = conversationId ? rtLoading : historyLoading;

//   // Mark as read once when convId appears
//   const [markRead] = useMarkReadMutation();
//   const didMarkRef = useRef(false);
//   useEffect(() => {
//     if (conversationId && !didMarkRef.current) {
//       markRead(conversationId);
//       didMarkRef.current = true;
//     }
//   }, [conversationId, markRead]);

//   // Sending messages: real-time if convId, else first send
//   const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
//   const handleSend = useCallback(
//     async (text: string) => {
//       try {
//         if (conversationId) {
//           // Real-time send
//           await sendMessage({ recipient: chatId, actionType: 'text', text, conversationId }).unwrap();
//         } else {
//           // First message create conv
//           const result = await sendMessage({ recipient: chatId, actionType: 'text', text }).unwrap();
//           setConversationId(result.conversationId);
//         }
//       } catch (err: any) {
//         Toast.show({ type: 'error', text1: err.data?.message || 'Unable to send message' });
//       }
//     },
//     [chatId, conversationId, sendMessage]
//   );
//   console.log(messages[0]);

//   return (
//     <View style={styles.container}>
//       <ConversationHeader
//         avatarUrl={avatarUrl || AVATAR_FALLBACK}
//         name={name || 'Chat'}
//         onBack={() => router.back()}
//       />

//       <KeyboardAvoidingView style={{ flex: 1 }}>
//         {loading && <Loader />}

//         {!loading && messages.length === 0 && (
//           <View style={styles.empty}>
//             <Text style={styles.emptyText}>Start a conversation…</Text>
//           </View>
//         )}

//         <FlatList
//           data={messages}
//           inverted
//           keyExtractor={(m) => m._id}
//           renderItem={({ item }) => {
//             const { sender, recipient } = item || {};

//             const outgoing = item.sender === userId;
//             // const outgoing = true;
//             const timestamp = new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//             if (item?.actionType === 'post') {
//               return <SharedPostBubble post={item.postPayload} timestamp={timestamp} outgoing={outgoing} />;
//             }
//             return <MessageBubble text={item.text || ''} timestamp={timestamp} outgoing={outgoing} />;
//           }}
//           contentContainerStyle={styles.messages}
//           onEndReached={async () => {
//             if (messages.length === 0) return; // no conv yet
//             const oldest = messages[messages.length - 1];
//             if (!oldest?.sentAt) return;
//             const nextCursor = oldest.sentAt;
//             try {
//               const result = await triggerGetMessagesByRecipient({
//                 recipientId: chatId,
//                 limit: 20,
//                 cursor: nextCursor,
//               }).unwrap();
//               setHistoricalMessages(prev => [...prev, ...result]);
//               setCursor(nextCursor);
//             } catch (error: any) {
//               console.error('[Chat] Failed to load historical messages', error);
//               Toast.show({ type: 'error', text1: 'Failed to load more messages' });
//             }
//           }}
//         />
//         <ChatInputBar onSend={handleSend} loading={sending} />
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { backgroundColor: theme.colors.background, flex: 1 },
//   messages: { padding: 12 },
//   empty: { paddingTop: 24, alignItems: 'center' },
//   emptyText: { color: theme.colors.textSecondary, fontSize: 14 },
// });
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Loader } from '../common';
import { ChatInputBar } from './ChatInputBar';
import { ConversationHeader } from './ConversationHeader';
import { MessageBubble } from './MessageBubble';
import { SharedPostBubble } from './SharedPostBubble';

import { AVATAR_FALLBACK } from '@/constants/AppConstants';
import {
  chatApi,
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

  const [conversationId, setConversationId] = useState<string>('');
  const [historicalMessages, setHistoricalMessages] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);

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
  [...messages, ...historicalMessages].forEach((msg) => {
    combinedMessagesMap.set(msg._id, msg);
  });
  const combinedMessages = Array.from(combinedMessagesMap.values());

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
          keyExtractor={(m) => m._id}
          renderItem={({ item }) => {
            const outgoing = item.sender === userId;
            const timestamp = new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (item?.actionType === 'post') {
              return <SharedPostBubble post={item.postPayload} timestamp={timestamp} outgoing={outgoing} />;
            }
            return <MessageBubble text={item.text || ''} timestamp={timestamp} outgoing={outgoing} />;
          }}
          contentContainerStyle={styles.messages}
          onEndReached={async () => {
            if (combinedMessages.length === 0) return;
            const oldest = combinedMessages[combinedMessages.length - 1];
            if (!oldest?.sentAt) return;

            const nextCursor = oldest.sentAt;
            console.log('[Chat] Loading more history with cursor:', nextCursor);

            try {
              setLoadingMore(true);
              const result = await triggerGetMessagesByRecipient({
                recipientId: chatId,
                limit: 20,
                cursor: nextCursor,
              }).unwrap();
              console.log('[Chat] Fetched more historical messages:', result);
              setHistoricalMessages(prev => [...prev, ...result]);
              setCursor(nextCursor);
            } catch (error: any) {
              console.error('[Chat] Failed to load historical messages', error);
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
