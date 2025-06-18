// src/features/feed/api/feedApi.ts
import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import { GetFeedResponse } from '../types';

export const feedApi = createApi({
  reducerPath: 'feedApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['Feed'],
  endpoints: (build) => ({
    getFeed: build.query<GetFeedResponse, { limit?: number; cursor?: string }>({
      query: ({ limit = 20, cursor }) => ({
        url: '/feed',
        method: 'GET',
        params: { limit, cursor },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map((p) => ({ type: 'Feed' as const, id: p._id })),
              { type: 'Feed', id: 'LIST' },
            ]
          : [{ type: 'Feed', id: 'LIST' }],
    }),
  }),
});

export const { useGetFeedQuery } = feedApi;
