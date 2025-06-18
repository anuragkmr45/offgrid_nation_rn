// src/features/post/hooks/usePost.ts
import { skipToken } from '@reduxjs/toolkit/query';
import {
    useCreatePostMutation,
    useLazySearchPostsQuery,
    useLikePostMutation,
    useListPostsByUsernameQuery,
} from '../api/postApi';

export function usePost(username?: string) {
  const [createPost, createStatus] = useCreatePostMutation();

  const listQuery = useListPostsByUsernameQuery(
    username ? { username, limit: 20 } : skipToken
  );

  const [likePost] = useLikePostMutation();

  // Lazy search hook
  const [triggerSearch, searchResult] = useLazySearchPostsQuery();

  return {
    // Create
    createPost,
    createStatus,

    // List
    list: listQuery.data?.posts ?? [],
    isListing: listQuery.isLoading,
    listRefetch: listQuery.refetch,
    hasMore: Boolean(listQuery.data?.nextCursor),

    // Like
    likePost,

    // Search
    search: (q: string, cursor?: string) =>
      triggerSearch({ query: q, limit: 20, cursor }),
    // Expose the trigger so callers can retry:
    retrySearch: triggerSearch,
    searchData: searchResult.data,
    isSearching: searchResult.isLoading,
    searchHasMore: Boolean(searchResult.data?.nextCursor),
  };
}
