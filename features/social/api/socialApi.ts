// src/features/social/api/socialApi.ts

import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import type {
    AcceptFollowRequestBody,
    AcceptFollowRequestResponse,
    BlockResponse,
    FollowResponse,
} from '../types';

export const socialApi = createApi({
  reducerPath: 'socialApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['SocialInteractions'],
  endpoints: (build) => ({
    followUser: build.mutation<FollowResponse, string>({
      query: (username) => ({
        url: `/user/follow/${username}`,
        method: 'POST',
      }),
      invalidatesTags: ['SocialInteractions'],
    }),

    blockUser: build.mutation<BlockResponse, string>({
      query: (username) => ({
        url: `/user/block/${username}`,
        method: 'POST',
      }),
      invalidatesTags: ['SocialInteractions'],
    }),

    acceptFollowRequest: build.mutation<AcceptFollowRequestResponse, AcceptFollowRequestBody>({
      query: (body) => ({
        url: `/user/accept-follow-request`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SocialInteractions'],
    }),
  }),
});

export const {
  useFollowUserMutation,
  useBlockUserMutation,
  useAcceptFollowRequestMutation,
} = socialApi;
