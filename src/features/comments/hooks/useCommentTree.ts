import { useState, useCallback } from 'react';
import { getAvatarForName } from '@/lib/avatars';
import { messages } from '@/lib/constants/messages';
import { buildCommentTree } from '@/lib/utils/buildCommentTree';
import type { CommentActionsValue } from '../contexts/CommentActionsContext';
import { useComments } from './useComments';
import { useCreateComment } from './useCreateComment';
import { useUpdateComment } from './useUpdateComment';
import { useDeleteComment } from './useDeleteComment';

export function useCommentTree(postId: string | undefined) {
  const { data: comments = [], isLoading, error } = useComments(postId);
  const createComment = useCreateComment(postId ?? '');
  const updateComment = useUpdateComment(postId ?? '');
  const deleteComment = useDeleteComment(postId ?? '');

  const [newCommentContent, setNewCommentContent] = useState('');
  const [newCommentName, setNewCommentName] = useState('');

  const tree = buildCommentTree(comments);

  const handleSubmitNew = useCallback(() => {
    if (!newCommentContent.trim() || !newCommentName.trim()) return;
    const name = newCommentName.trim();
    createComment.mutate(
      {
        content: newCommentContent.trim(),
        name,
        avatar: getAvatarForName(name),
        parentId: null,
      },
      {
        onSuccess: () => {
          setNewCommentContent('');
          setNewCommentName('');
        },
      }
    );
  }, [
    newCommentContent,
    newCommentName,
    createComment,
  ]);

  const onReply = useCallback(
    (
      parentId: string,
      data: { content: string; name: string },
      options?: { onSuccess?: () => void }
    ) => {
      const name = data.name.trim();
      createComment.mutate(
        {
          content: data.content.trim(),
          name,
          avatar: getAvatarForName(name),
          parentId,
        },
        {
          onSuccess: () => {
            options?.onSuccess?.();
          },
        }
      );
    },
    [createComment]
  );

  const onEdit = useCallback(
    (
      commentId: string,
      content: string,
      options?: { onSuccess?: () => void }
    ) => {
      updateComment.mutate(
        { commentId, comment: { content: content.trim() } },
        {
          onSuccess: () => {
            options?.onSuccess?.();
          },
        }
      );
    },
    [updateComment]
  );

  const onDelete = useCallback(
    (commentId: string, hasReplies: boolean) => {
      const msg = hasReplies
        ? messages.confirm.deleteCommentWithReplies
        : messages.confirm.deleteComment;
      if (window.confirm(msg)) {
        deleteComment.mutate(commentId);
      }
    },
    [deleteComment]
  );

  const commentActions: CommentActionsValue = {
    onReply,
    onEdit,
    onDelete,
    isReplying: createComment.isPending,
    isEditing: updateComment.isPending,
  };

  return {
    tree,
    comments,
    isLoading,
    error,
    newCommentName,
    setNewCommentName,
    newCommentContent,
    setNewCommentContent,
    handleSubmitNew,
    isSubmitting: createComment.isPending,
    commentActions,
  };
}
