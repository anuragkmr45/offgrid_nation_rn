// src/features/profile/api/profileApi.ts
import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { UpdateProfilePayload, UserProfile } from '../types';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['Profile'],
  endpoints: build => ({
    // 3.1 Get Your Profile
    getMyProfile: build.query<UserProfile, void>({
      query: () => ({ url: '/user/profile', method: 'GET' }),
      providesTags: ['Profile'],
    }),
    // 3.2 View Another User’s Profile
    getUserProfile: build.query<UserProfile, string>({
      query: username => ({ url: `/user/${username}`, method: 'GET' }),
    }),
    // 3.3 Update Your Profile
    updateProfile: build.mutation<
      { message: string; profile: Partial<UserProfile> },
      UpdateProfilePayload
    >({
      query: body => ({ url: '/user/profile', method: 'PUT', body }),
      invalidatesTags: ['Profile'],
    }),
    // 3.4 Upload Profile Picture
    uploadProfilePicture: build.mutation<
      { message: string; profilePictureUrl: string },
      FormData
    >({
      query: formData => ({
        url: '/user/profile/upload-picture',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const {
  useGetMyProfileQuery,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
} = profileApi
