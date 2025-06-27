// src/features/chat/hooks/useChat.ts
import { useEffect, useRef, useState } from 'react';
import {
  useGetConversationsQuery,
  useGetMessagesByConversationQuery,
  useGetMessagesByRecipientQuery,
  useMarkReadMutation,
  useSearchUsersQuery,
  useSendMessageMutation,
} from '../api/chatApi';
import type { Message } from '../types';

/**
 * Hook to manage conversations and chat messages with real-time updates.
 * Provides conversation list, search, message fetching, sending, and read marking.
 */
export const useChat = (conversationId?: string) => {
  // --- Conversations & Search ---
  const {
    data: conversations = [],
    isLoading: convLoading,
    error: convError,
    refetch: refetchConversations,
  } = useGetConversationsQuery(undefined, { refetchOnMountOrArgChange: true });

  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: users = [],
    isLoading: userSearchLoading,
    error: userSearchError,
  } = useSearchUsersQuery(searchTerm, { skip: !searchTerm });

  // --- Messages by Recipient (historical) ---
  const {
    data: history = [],
    isLoading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useGetMessagesByRecipientQuery(
    { recipientId: conversationId ?? '' },
    { skip: !conversationId }
  );

  // --- Messages by Conversation (real-time + pagination) ---
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const limit = 20;

  const {
    data: page = [],
    isLoading: pageLoading,
    error: pageError,
  } = useGetMessagesByConversationQuery(
    { conversationId: conversationId ?? '', cursor, limit },
    { skip: !conversationId, refetchOnMountOrArgChange: true }
  );

  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const lastPageIdRef = useRef<string | null>(null);

  useEffect(() => {
    const newPageId = page.length ? page[page.length - 1]._id : null;
    if (newPageId === lastPageIdRef.current) return;
    lastPageIdRef.current = newPageId;

    if (cursor) {
      setAllMessages(prev => [...prev, ...page]);
    } else {
      setAllMessages(page);
    }
  }, [page, cursor]);

  useEffect(() => {
    setCursor(undefined);
    setAllMessages([]);
    lastPageIdRef.current = null;
  }, [conversationId]);

  const loadMore = () => {
    const last = allMessages[allMessages.length - 1];
    if (last?.sentAt) setCursor(last.sentAt);
  };

  // --- Sending & Read ---
  const [sendMessage, { isLoading: sending, error: sendError }] = useSendMessageMutation();
  const [markRead, { isLoading: marking, error: markError }] = useMarkReadMutation();

  // mark conversation read on mount
  useEffect(() => {
    if (conversationId) markRead(conversationId);
  }, [conversationId, markRead]);

  return {
    // Conversations
    conversations,
    convLoading,
    convError,
    refetchConversations,
    // User Search
    users,
    userSearchLoading,
    userSearchError,
    setSearchTerm,
    // Historical messages
    history,
    historyLoading,
    historyError,
    refetchHistory,
    // Real-time messages
    messages: allMessages,
    pageLoading,
    pageError,
    loadMore,
    // Actions
    sendMessage,
    sending,
    sendError,
    markRead,
    marking,
    markError,
  } as const;
};
