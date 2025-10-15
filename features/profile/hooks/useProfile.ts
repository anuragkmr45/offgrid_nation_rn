// src/features/profile/hooks/useProfile.ts
import {
  useDeleteAccountMutation,
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
} from '../api/profileApi'

export function useProfile() {
  const { data: myProfile, isLoading: isLoadingProfile, refetch } = useGetMyProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [uploadPicture, { isLoading: isUploading }] = useUploadProfilePictureMutation()
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation()

  return {
    myProfile,
    isLoadingProfile,
    refetch,
    updateProfile,
    isUpdating,
    uploadPicture,
    isUploading,
    deleteAccount,
    isDeleting,
  }
}
