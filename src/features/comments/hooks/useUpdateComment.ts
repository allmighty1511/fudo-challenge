import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '../api/commentsApi';
import type { Comment } from '@/types';

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      comment,
    }: {
      commentId: string;
      comment: Partial<Comment>;
    }) => updateComment(postId, commentId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}
