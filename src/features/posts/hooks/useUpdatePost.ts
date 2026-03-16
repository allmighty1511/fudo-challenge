import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost } from '../api/postsApi';
import type { Post } from '@/types';

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, post }: { id: string; post: Partial<Post> }) =>
      updatePost(id, post),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
    },
  });
}
