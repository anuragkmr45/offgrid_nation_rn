import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  CreateCheckoutSessionResponse,
  PremiumFeedResponse
} from '../types';

export const premiumApi = createApi({
  reducerPath: 'premiumApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['PremiumFeed', 'CheckoutSession'],
  endpoints: (build) => ({
    createCheckoutSession: build.mutation<CreateCheckoutSessionResponse, void>({
      query: () => ({
        url: '/user/payments/create-session',
        method: 'POST',
      }),
      invalidatesTags: ['CheckoutSession'],
    }),
    getPremiumFeed: build.query<PremiumFeedResponse, void>({
      query: () => '/feed/premium',
      providesTags: ['PremiumFeed'],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetPremiumFeedQuery,
} = premiumApi;
