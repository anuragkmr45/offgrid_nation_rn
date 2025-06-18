// src/features/post/api/postApi.ts
import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
    CreatePostRequest,
    CreatePostResponse,
    LikePostResponse,
    ListPostsByUsernameResponse,
    SearchPostsResponse
} from '../types';

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
    listPostsByUsername: build.query<ListPostsByUsernameResponse, { username: string; limit?: number; cursor?: string }>({
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
      invalidatesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
    }),
    searchPosts: build.query<SearchPostsResponse, { query: string; limit?: number; cursor?: string }>({
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
  }),
});

export const {
  useCreatePostMutation,
  useListPostsByUsernameQuery,
  useLikePostMutation,
  useSearchPostsQuery,
  useLazySearchPostsQuery,
} = postApi;
