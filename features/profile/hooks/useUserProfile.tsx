// src/features/profile/hooks/useUserProfile.ts
import { useGetMyProfileQuery, useGetUserProfileQuery } from '../api/profileApi'

export function useUserProfile(username?: string) {
  const {
    data: myProfile,
    isLoading: isLoadingMy,
    refetch: refetchMy,
  } = useGetMyProfileQuery(undefined, { skip: !!username })

  const {
    data: userProfile,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useGetUserProfileQuery(username!, { skip: !username })

  return {
    user: username ? userProfile : myProfile,
    loading: username ? isLoadingUser : isLoadingMy,
    refetch: username ? refetchUser : refetchMy,
  }
}
