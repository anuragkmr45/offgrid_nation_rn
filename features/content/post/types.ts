// src/features/post/types.ts
export interface Post {
  _id: string;
  userId: string;
  media: string[];
  content: string;
  location?: string;
  likes: string[];
  commentsCount: number;
  likesCount?: number;
  isLiked?: boolean;
  isFollowing?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  content: string;
  location?: string;
  media?: File[];
}

export type CreatePostResponse = Post;

export interface ListPostsByUsernameResponse {
  posts: (Post & {
      likesCount: number;
      isLiked: boolean;
      isFollowing: boolean;
    })[];
  nextCursor?: string;
}

export interface LikePostResponse {
  message: string;
  likesCount: number;
  isLiked: boolean;
}

export interface SearchPostsResponse {
  posts: (Pick<Post, '_id' | 'media' | 'content' | 'location' | 'commentsCount' | 'createdAt' | 'updatedAt'> & {
      userId: { _id: string; username: string; fullName: string; profilePicture: string };
      likesCount: number;
      isLiked: boolean;
      isFollowing: boolean;
    })[];
  nextCursor?: string;
}

export interface CreateReportRequest {
  postId: string;
  /** optional; send empty string "" if reporting a post only */
  commentId?: string;
  reason: string; // e.g. "Sexual content"
}

export interface CreateReportResponse {
  message: string; // server acknowledgement
}