import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../api/postsApi';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: 30_000,
  });
}
