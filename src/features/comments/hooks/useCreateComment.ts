import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../api/commentsApi';
import type { Comment } from '@/types';

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Partial<Comment>) => createComment(postId, comment),
    onSuccess: (newComment) => {
      // setQueryData en vez de invalidate: MockAPI devuelve limit y perdemos los ya cargados
      queryClient.setQueryData<Comment[]>(['comments', postId], (old) =>
        old ? [...old, newComment] : [newComment]
      );
    },
  });
}
