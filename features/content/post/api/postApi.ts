// src/features/post/api/postApi.ts
import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  CreatePostRequest,
  CreatePostResponse,
  CreateReportRequest,
  CreateReportResponse,
  LikePostResponse,
  ListPostsByUsernameResponse,
  SearchPostsResponse
} from '../types';

// 🔽 Add this import for the optimistic cache patch into the feed
import { feedApi } from '@/features/content/feed/api/feedApi';

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['Post'],
  endpoints: (build) => ({
    createPost: build.mutation<CreatePostResponse, CreatePostRequest>({
      query: ({ media, ...body }) => {
        const formData = new FormData();
        formData.append('content', body.content);
        if (body.location) formData.append('location', body.location);
        media?.forEach((file) => formData.append('media', file));
        return {
          url: '/post',
          method: 'POST',
          body: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        };
      },
      invalidatesTags: ['Post'],
    }),

    listPostsByUsername: build.query<
      ListPostsByUsernameResponse,
      { username: string; limit?: number; cursor?: string }
    >({
      query: ({ username, limit = 20, cursor }) => ({
        url: `/post/${username}`,
        method: 'GET',
        params: { limit, cursor },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.posts.map(({ _id }) => ({ type: 'Post' as const, id: _id })),
            { type: 'Post', id: 'LIST' },
          ]
          : [{ type: 'Post', id: 'LIST' }],
    }),

    likePost: build.mutation<LikePostResponse, { postId: string }>({
      query: ({ postId }) => ({
        url: `/post/${postId}/like`,
        method: 'POST',
        body: {},
      }),

      // ⭐️ Optimistic cache update (Option 2)
      // This updates the Feed cache immediately so the Like state persists after navigation.
      // Your feedApi uses `serializeQueryArgs: ({ endpointName }) => endpointName`,
      // so any arg object will map to the same cache key. We use { limit: 6, cursor: undefined }
      // to match your common hook usage in useFeed().
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        // 1) Optimistically toggle the post in the feed cache
        const patch = dispatch(
          feedApi.util.updateQueryData('getFeed', { limit: 6, cursor: undefined }, (draft) => {
            const p = draft.posts.find((x) => x._id === postId);
            if (p) {
              const was = p.isLiked;
              p.isLiked = !was;
              p.likesCount += was ? -1 : 1;
            }
          })
        );

        try {
          // 2) Wait for server; if it returns truth, reconcile exactly
          const { data } = await queryFulfilled;

          // Guard in case your LikePostResponse differs; we only override if fields exist
          const hasIsLiked = data && Object.prototype.hasOwnProperty.call(data, 'isLiked');
          const hasLikesCount = data && Object.prototype.hasOwnProperty.call(data, 'likesCount');

          if (hasIsLiked || hasLikesCount) {
            dispatch(
              feedApi.util.updateQueryData('getFeed', { limit: 6, cursor: undefined }, (draft) => {
                const p = draft.posts.find((x) => x._id === postId);
                if (p) {
                  if (hasIsLiked) (p as any).isLiked = (data as any).isLiked;
                  if (hasLikesCount) (p as any).likesCount = (data as any).likesCount;
                }
              })
            );
          }
        } catch {
          // 3) Rollback on failure
          patch.undo();
        }
      },

      // You can keep invalidatesTags if you want a later refetch; not required for Option 2.
      // Removing it avoids extra network calls; keeping it is harmless but redundant.
      // invalidatesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
    }),

    searchPosts: build.query<
      SearchPostsResponse,
      { query: string; limit?: number; cursor?: string }
    >({
      query: ({ query, limit = 20, cursor }) => ({
        url: '/post/content/search',
        method: 'GET',
        params: { query, limit, cursor },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.posts.map((p) => ({ type: 'Post' as const, id: p._id })),
            { type: 'Post', id: 'SEARCH' },
          ]
          : [{ type: 'Post', id: 'SEARCH' }],
    }),
    reportPostOrComment: build.mutation<CreateReportResponse, CreateReportRequest>({
      query: (body) => ({
        url: '/reports',
        method: 'POST',
        body, // fetchBaseQuery will set Content-Type: application/json
      }),
    }),
  }),
});

export const {
  useCreatePostMutation,
  useListPostsByUsernameQuery,
  useLikePostMutation,
  useSearchPostsQuery,
  useLazySearchPostsQuery,
  useReportPostOrCommentMutation,
} = postApi;
