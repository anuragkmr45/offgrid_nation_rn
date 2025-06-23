// src/features/chat/hooks/useChat.ts
import { useEffect, useRef, useState } from 'react';
import { useGetMessagesQuery, useSendMessageMutation } from '../api/chatApi';
import type { Message } from '../types';

/**
 * Hook to fetch and paginate chat messages, with real-time updates via RTK Query & Pusher.
 * @param conversationId - the ID of the conversation to load messages for
 */
export const useChatMessages = (conversationId: string) => {
  // pagination cursor (ISO timestamp of last loaded message)
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  // fetch each page whenever `conversationId` or `cursor` changes
  const {
    data: page = [],
    isLoading,
    error,
  } = useGetMessagesQuery({ conversationId, cursor });

  // accumulate pages in a single list
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  // track last page's last-message ID to avoid duplicate appends
  const lastPageIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    // determine a stable ID for this page: the last message's _id, or null
    const newPageId = page.length ? page[page.length - 1]._id : null;

    // if this page hasn't changed, do nothing
    if (newPageId === lastPageIdRef.current) return;
    lastPageIdRef.current = newPageId;

    if (cursor) {
      // older pages → append to end
      setAllMessages(prev => [...prev, ...page]);
    } else {
      // initial load or reset → replace
      setAllMessages(page);
    }
  }, [page, cursor]);

  // reset everything when switching conversations
  useEffect(() => {
    setCursor(undefined);
    setAllMessages([]);
    lastPageIdRef.current = null;
  }, [conversationId]);

  // mutation for sending messages
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();

  // load more: set the cursor to the oldest loaded message's sentAt timestamp
  const loadMore = () => {
    const last = allMessages[allMessages.length - 1];
    if (last?.sentAt) {
      setCursor(last.sentAt);
    }
  };

  return {
    messages: allMessages,
    isLoading,
    error,
    sendMessage,
    sending,
    loadMore,
    setAllMessages,
  };
};
