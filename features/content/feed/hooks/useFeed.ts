// src/features/feed/hooks/useFeed.ts
import { useState } from 'react';
import { useGetFeedQuery } from '../api/feedApi';

export function useFeed() {
  // keep the pagination cursor in state
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  // pass limit + cursor into the hook
  const feedQuery = useGetFeedQuery({ limit: 20, cursor });

  return {
    posts: feedQuery.data?.posts ?? [],
    isLoading: feedQuery.isLoading,
    refetch: feedQuery.refetch,                // still works, no args
    hasMore: Boolean(feedQuery.data?.nextCursor),
    fetchNext: () => {
      const next = feedQuery.data?.nextCursor;
      if (next) {
        setCursor(next);                        // trigger the hook to refetch
      }
    },
  };
}
