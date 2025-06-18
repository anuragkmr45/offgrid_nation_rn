// src/features/chat/hooks/useChat.ts
import { useEffect, useState } from 'react';
import { useGetMessagesQuery, useSendMessageMutation } from '../api/chatApi';
import { Message } from '../types';

export const useChatMessages = (conversationId: string) => {
  // local state for the pagination cursor
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  // fetch each page whenever cursor changes
  const {
    data: page = [],
    isLoading,
    error,
  } = useGetMessagesQuery({ conversationId, cursor });

  // accumulate pages in a single list
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (cursor) {
      // older page → append to end
      setAllMessages((prev) => [...prev, ...page]);
    } else {
      // initial load → replace
      setAllMessages(page);
    }
  }, [page]);

  // reset when switching conversations
  useEffect(() => {
    setCursor(undefined);
    setAllMessages([]);
  }, [conversationId]);

  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();

  // expose a loadMore function instead of fetchNextPage
  const loadMore = () => {
    const last = allMessages[allMessages.length - 1];
    if (last?.sentAt) {
      setCursor(last.sentAt);  // triggers next-page fetch
    }
  };

  return {
    messages: allMessages,
    isLoading,
    error,
    sendMessage,
    sending,
    loadMore,
  };
};
