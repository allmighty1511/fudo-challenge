import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../api/postsApi';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.removeQueries({ queryKey: ['post', id] });
    },
  });
}
