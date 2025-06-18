// src/features/feed/types.ts
export interface FeedPost {
  _id: string;
  userId: {
    _id: string;
    username: string;
    fullName: string;
    profilePicture: string;
  };
  media: string[];
  content: string;
  location?: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  isFollowing: boolean;
}

export interface GetFeedResponse {
  posts: FeedPost[];
  nextCursor?: string;
}
