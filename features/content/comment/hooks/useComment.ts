// src/features/comment/hooks/useComment.ts
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useAddCommentMutation,
  useAddReplyMutation,
  useListCommentsQuery,
  useListRepliesQuery,
} from '../api/commentApi';

export function useComment(postId?: string) {
  const [addComment] = useAddCommentMutation();
  const listComments = useListCommentsQuery(
    postId ? { postId, limit: 20 } : skipToken
  );
  const [addReply] = useAddReplyMutation();
  const listReplies = useListRepliesQuery(
    listComments.data?.comments[0]?._id
      ? { commentId: listComments.data.comments[0]._id, limit: 20 }
      : skipToken
  );
  const getReplies = (commentId: string) => useListRepliesQuery(
    commentId ? { commentId, limit: 20 } : skipToken
  )

  return {
    addComment,
    comments: listComments.data?.comments ?? [],
    isLoadingComments: listComments.isLoading,
    commentRefetch: listComments.refetch,
    hasMoreComments: Boolean(listComments.data?.nextCursor),
    addReply,
    replies: listReplies.data?.replies ?? [],
    isLoadingReplies: listReplies.isLoading,
    repliesRefetch: listReplies.refetch,
    hasMoreReplies: Boolean(listReplies.data?.nextCursor),
    getReplies
  };
}
