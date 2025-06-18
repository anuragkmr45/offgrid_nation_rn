export interface UserProfile {
  _id: string
  username: string
  fullName: string
  bio: string
  profilePicture: string
  isPrivate: boolean
  isPremium?: boolean
  followersCount: number
  followingCount: number
  blockedUsersCount?: number
  followRequestsCount?: number
  postsCount: number
  createdAt: string
  updatedAt: string
}

export interface UpdateProfilePayload {
  username?: string
  fullName?: string
  bio?: string
}
