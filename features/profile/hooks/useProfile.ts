// src/features/profile/hooks/useProfile.ts
import { useCallback } from 'react'
import {
    useGetMyProfileQuery,
    useGetUserProfileQuery,
    useUpdateProfileMutation,
    useUploadProfilePictureMutation,
} from '../api/profileApi'

export function useProfile() {
  const { data: myProfile, isLoading: isLoadingProfile, refetch } = useGetMyProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [uploadPicture, { isLoading: isUploading }] = useUploadProfilePictureMutation()

  // Helper to fetch another user
  const getUser = useCallback((username: string) => useGetUserProfileQuery(username), [])

  return {
    myProfile,
    isLoadingProfile,
    refetch,
    updateProfile,
    isUpdating,
    uploadPicture,
    isUploading,
    getUser,
  }
}
