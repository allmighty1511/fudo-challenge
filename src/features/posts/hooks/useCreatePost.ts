import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api/postsApi';
import type { Post } from '@/types';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: Partial<Post>) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
