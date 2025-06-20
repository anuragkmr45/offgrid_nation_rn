// src/features/profile/hooks/useProfile.ts
import {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation
} from '../api/profileApi'

export function useProfile() {
  const { data: myProfile, isLoading: isLoadingProfile, refetch } = useGetMyProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [uploadPicture, { isLoading: isUploading }] = useUploadProfilePictureMutation()

  return {
    myProfile,
    isLoadingProfile,
    refetch,
    updateProfile,
    isUpdating,
    uploadPicture,
    isUploading,
  }
}
