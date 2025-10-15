// src/features/list/api/listApi.ts
import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  BlockedResponse,
  FollowersResponse,
  FollowingResponse,
  SearchUsersResponse
} from '../types';

export const listApi = createApi({
  reducerPath: 'listApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['Followers', 'Following', 'SearchUsers', 'Blocked'],
  endpoints: (build) => ({
    getFollowers: build.query<FollowersResponse, string>({
      query: (username) => ({
        url: `/user/${username}/followers`,
        method: 'GET',
      }),
      providesTags: (result, error, username) =>
        result
          ? [
            ...result.followers.map(({ _id }) => ({ type: 'Followers' as const, id: _id })),
            { type: 'Followers', id: `LIST::${username}` }
          ]
          : [{ type: 'Followers', id: `LIST::${username}` }],
    }),
    getFollowing: build.query<FollowingResponse, string>({
      query: (username) => ({
        url: `/user/${username}/following`,
        method: 'GET',
      }),
      providesTags: (result, error, username) =>
        result
          ? [
            ...result.following.map(({ _id }) => ({ type: 'Following' as const, id: _id })),
            { type: 'Following', id: `LIST::${username}` }
          ]
          : [{ type: 'Following', id: `LIST::${username}` }],
    }),
    searchUsers: build.query<SearchUsersResponse, string>({
      query: (q) => ({
        url: `/user/search`,
        method: 'GET',
        params: { query: q },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.users.map(({ _id }) => ({ type: 'SearchUsers' as const, id: _id })),
            { type: 'SearchUsers', id: 'QUERY' }
          ]
          : [{ type: 'SearchUsers', id: 'QUERY' }],
    }),
    getBlocked: build.query<BlockedResponse, void>({
      query: () => ({
        url: `/user/blocked`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.blocked.map(({ _id }) => ({ type: 'Blocked' as const, id: _id })),
            { type: 'Blocked', id: 'LIST' },
          ]
          : [{ type: 'Blocked', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useSearchUsersQuery,
  useGetBlockedQuery,
} = listApi;
