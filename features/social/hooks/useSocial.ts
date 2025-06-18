// src/features/social/hooks/useSocial.ts

import {
    useAcceptFollowRequestMutation,
    useBlockUserMutation,
    useFollowUserMutation,
} from '@/features/social/api/socialApi';

export const useSocial = () => {
  const [followUser, { data: followData, isLoading: isFollowLoading }] = useFollowUserMutation();
  const [blockUser, { data: blockData, isLoading: isBlockLoading }] = useBlockUserMutation();
  const [acceptFollowRequest, { data: acceptData, isLoading: isAcceptLoading }] =
    useAcceptFollowRequestMutation();

  return {
    followUser,
    blockUser,
    acceptFollowRequest,
    followData,
    blockData,
    acceptData,
    isFollowLoading,
    isBlockLoading,
    isAcceptLoading,
  };
};
