// src/features/feed/hooks/useFeed.ts
import { useState } from 'react';
import { useGetFeedQuery } from '../api/feedApi';
export function useFeed() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const feedQuery = useGetFeedQuery({ limit: 20, cursor });
  return {
    posts: feedQuery.data?.posts ?? [],
    isLoading: feedQuery.isLoading,
    isFetching: feedQuery.isFetching,
    refetch: () => {
      // reset cursor to fetch fresh
      setCursor(undefined);
      feedQuery.refetch();
    },
    hasMore: Boolean(feedQuery.data?.nextCursor),
    fetchNext: () => {
      const next = feedQuery.data?.nextCursor;
      if (next) setCursor(next);
    },
  };
}
