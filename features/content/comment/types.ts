// src/features/comment/types.ts
export interface CommentUser {
  _id: string;
  username: string;
  fullName: string;
  profilePicture: string;
}

export interface Reply {
  _id: string;
  commentId: string;
  userId: string;
  content: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  postId: string;
  userId: CommentUser;
  content: string;
  likes: string[];
  repliesCount: number;
  isFollowing: boolean;
  latestReplies?: Array<{
    userId: string;
    username: string;
    fullName: string;
    profilePicture: string;
    replyContent: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AddCommentRequest {
  content: string;
}

export type AddCommentResponse = Comment;

export interface ListCommentsResponse {
  comments: Comment[];
  nextCursor?: string;
}

export interface AddReplyRequest {
  content: string;
}

export type AddReplyResponse = Reply;

export interface ListRepliesResponse {
  replies: Reply[];
  nextCursor?: string;
}
