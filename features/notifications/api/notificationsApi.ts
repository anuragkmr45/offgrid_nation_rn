// src/features/notifications/api/notificationsApi.ts

import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import type {
    ListNotificationsResponse,
    MarkAsReadRequest,
    MarkAsReadResponse,
    NotificationItem
} from '../types';

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['Notifications'],
  endpoints: (build) => ({
    listNotifications: build.query<
      ListNotificationsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => ({
        url: `/notifications`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              // provides a LIST tag for refetch-all
              { type: 'Notifications' as const, id: 'LIST' },
              // and one tag per item
              ...result.items.map((item: NotificationItem) => ({
                type: 'Notifications' as const,
                id: item._id,
              })),
            ]
          : [{ type: 'Notifications' as const, id: 'LIST' }],
    }),

    markAsRead: build.mutation<MarkAsReadResponse, MarkAsReadRequest>({
      query: (body) => ({
        url: `/notifications/mark-read`,
        method: 'PUT',
        body,
      }),
      // after marking read, we want to refetch the list
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useMarkAsReadMutation,
} = notificationsApi;
