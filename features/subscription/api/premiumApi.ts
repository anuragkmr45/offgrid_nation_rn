// features/subscription/api/premiumApi.ts
import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  CreateCheckoutSessionResponse,
  PremiumFeedResponse
} from '../types';

export type SyncIosIapPayload = {
  platform: 'ios';
  // everything from snapshotEntitlements(...)
  rcAppUserId: string | null;
  activeSubscriptions: string[];
  allPurchasedProductIds: string[];
  latestExpirationDate: string | null;
  requestDate: string;
  managementURL: string | null;
  activeEntitlements: {
    id: string;
    isActive: boolean;
    willRenew: boolean;
    periodType: 'TRIAL' | 'INTRO' | 'NORMAL';
    latestPurchaseDate: string;
    originalPurchaseDate: string;
    expirationDate: string | null;
    productId: string;
    store: string;
    isSandbox: boolean;
    unsubscribeDetectedAt: string | null;
    billingIssueDetectedAt: string | null;
  }[];
};

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

    syncIosIap: build.mutation<{ ok: true }, SyncIosIapPayload>({
      query: (body) => ({
        url: '/subscriptions/ios/sync',
        method: 'POST',
        body,
      }),
      // ✅ Trigger a refresh of the premium feed once backend is updated
      invalidatesTags: ['PremiumFeed'],
      // (Optional) If you want instant UI flip without waiting for refetch,
      // you can uncomment the optimistic patch below. Safe to omit since your hook
      // already sets `iosProLocal` to true for instant gating.
      /*
      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        let patch: any;
        try {
          patch = dispatch(
            premiumApi.util.updateQueryData('getPremiumFeed', undefined, (draft) => {
              if (draft) draft.isPremium = true;
            })
          );
        } catch {}
        try { await queryFulfilled; } catch { patch?.undo?.(); }
      },
      */
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetPremiumFeedQuery,
  // (Optional) export the lazy hook if you want to manually fetch in other screens
  useLazyGetPremiumFeedQuery,
  useSyncIosIapMutation
} = premiumApi;
