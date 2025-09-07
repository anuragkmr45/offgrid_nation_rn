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
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newData) => {
        const indexById = new Map<string, number>();
        currentCache.posts.forEach((p, i) => indexById.set(p._id, i));

        for (const np of newData.posts) {
          const idx = indexById.get(np._id);
          if (idx != null) {
            currentCache.posts[idx] = { ...currentCache.posts[idx], ...np }; // replace in place
          } else {
            indexById.set(np._id, currentCache.posts.length);
            currentCache.posts.push(np); // keep infinite scroll behavior
          }
        }
        currentCache.nextCursor = newData.nextCursor;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor
      },
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
