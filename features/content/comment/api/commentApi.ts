// src/features/comment/api/commentApi.ts
import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
    AddCommentRequest,
    AddCommentResponse,
    AddReplyRequest,
    AddReplyResponse,
    ListCommentsResponse,
    ListRepliesResponse
} from '../types';

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['Comment'],
  endpoints: (build) => ({
    addComment: build.mutation<AddCommentResponse, { postId: string; data: AddCommentRequest }>({
      query: ({ postId, data }) => ({
        url: `/comment/${postId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_res, _err, { postId }) => [{ type: 'Comment', id: postId }],
    }),
    listComments: build.query<ListCommentsResponse, { postId: string; limit?: number; cursor?: string }>({
      query: ({ postId, limit = 20, cursor }) => ({
        url: `/comment/${postId}`,
        method: 'GET',
        params: { limit, cursor },
      }),
      providesTags: (result, _err, { postId }) =>
        result
          ? [
              ...result.comments.map(({ _id }) => ({ type: 'Comment' as const, id: _id })),
              { type: 'Comment', id: `POST_${postId}` },
            ]
          : [{ type: 'Comment', id: `POST_${postId}` }],
    }),
    addReply: build.mutation<AddReplyResponse, { commentId: string; data: AddReplyRequest }>({
      query: ({ commentId, data }) => ({
        url: `/comment/${commentId}/reply`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_res, _err, { commentId }) => [{ type: 'Comment', id: commentId }],
    }),
    listReplies: build.query<ListRepliesResponse, { commentId: string; limit?: number; cursor?: string }>({
      query: ({ commentId, limit = 20, cursor }) => ({
        url: `/comment/reply/${commentId}`,
        method: 'GET',
        params: { limit, cursor },
      }),
      providesTags: (result, _err, { commentId }) =>
        result
          ? [
              ...result.replies.map(({ _id }) => ({ type: 'Comment' as const, id: _id })),
              { type: 'Comment', id: `REPLY_${commentId}` },
            ]
          : [{ type: 'Comment', id: `REPLY_${commentId}` }],
    }),
  }),
});

export const {
  useAddCommentMutation,
  useListCommentsQuery,
  useAddReplyMutation,
  useListRepliesQuery,
} = commentApi;
