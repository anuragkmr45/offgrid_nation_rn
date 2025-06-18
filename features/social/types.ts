// src/features/social/types.ts

export interface FollowResponse {
  message: string;
  followersCount: number;
  followingCount: number;
}

export interface BlockResponse {
  message: string;
  blockedUsersCount: number;
}

export interface AcceptFollowRequestBody {
  requesterId: string;
}

export interface AcceptFollowRequestResponse {
  message: string;
  followersCount: number;
  followRequestsCount: number;
}
