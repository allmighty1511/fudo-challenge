import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../api/commentsApi';
import type { Comment } from '@/types';

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Partial<Comment>) => createComment(postId, comment),
    onSuccess: (newComment) => {
      // Añadir el nuevo comentario a la lista existente en lugar de invalidar.
      // Evita que un refetch con datos incompletos (p. ej. límites de MockAPI)
      // borre los comentarios ya mostrados.
      queryClient.setQueryData<Comment[]>(['comments', postId], (old) =>
        old ? [...old, newComment] : [newComment]
      );
    },
  });
}
