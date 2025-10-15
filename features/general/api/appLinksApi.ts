// src/features/appLinks/api/appLinksApi.ts
import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { AppDownloadLinks } from '../types';

export const appLinksApi = createApi({
  reducerPath: 'appLinksApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['AppLinks'],
  /**
   * Keep the data in the cache for 24 h after the last component unmounts.
   * Saves a network round-trip every time the user revisits Settings.
   */
  keepUnusedDataFor: 60 * 60 * 24,
  endpoints: (build) => ({
    /**
     * GET /user/download/links → App store URLs
     */
    getAppDownloadLinks: build.query<AppDownloadLinks[], void>({
      query: () => ({ url: '/user/download/links', method: 'GET' }),
      providesTags: ['AppLinks'],
    }),
  }),
});

export const { useGetAppDownloadLinksQuery } = appLinksApi;
