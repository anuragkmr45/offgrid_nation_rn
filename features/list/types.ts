// src/features/list/types.ts

export interface UserListItem {
  _id: string;
  username: string;
  fullName: string;
  profilePicture: string;
  isFollowing: boolean;
  isBlocked: boolean;
}

export interface FollowersResponse {
  count: number;
  followers: UserListItem[];
}

export interface FollowingResponse {
  count: number;
  following: UserListItem[];
}

export interface SearchUsersResponse {
  users: UserListItem[];
}
