// src/features/notifications/types.ts

export type NotificationType =
  | 'follow'
  | 'follow_request'
  | 'follow_accept'
  | 'post_like'
  | 'post_comment'
  | 'comment_reply'
  | 'comment_like'
  | 'reply_like';

export interface NotificationItem {
  _id: string;
  toUserId: string;
  fromUserId: string;
  type: NotificationType;
  postId?: string;
  commentId?: string;
  replyId?: string;
  message: string;
  senderUsername: string;
  profilePicture: string;
  read: boolean;
  createdAt: string;
  __v: number;
}

export interface ListNotificationsResponse {
  page: number;
  total: number;
  items: NotificationItem[];
}

export interface MarkAsReadRequest {
  ids: string[];
}

export interface MarkAsReadResponse {
  message: string;
}
