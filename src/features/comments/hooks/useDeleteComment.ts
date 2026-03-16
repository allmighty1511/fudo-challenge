import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment, getComments } from '../api/commentsApi';
import { getDescendantIds } from '@/lib/utils/buildCommentTree';
import type { Comment } from '@/types';

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const comments =
        queryClient.getQueryData<Comment[]>(['comments', postId]) ??
        (await getComments(postId));

      const descendantIds = getDescendantIds(comments, commentId);
      for (const id of descendantIds) {
        await deleteComment(postId, id);
      }
      return deleteComment(postId, commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}
