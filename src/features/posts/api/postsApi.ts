import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { Post } from '@/types';

export async function getPosts(): Promise<Post[]> {
  const { data } = await apiClient.get<Post[]>(endpoints.posts());
  return data;
}

export async function getPost(id: string): Promise<Post> {
  const { data } = await apiClient.get<Post>(endpoints.post(id));
  return data;
}

export async function createPost(post: Partial<Post>): Promise<Post> {
  const { data } = await apiClient.post<Post>(endpoints.posts(), post);
  return data;
}

export async function updatePost(id: string, post: Partial<Post>): Promise<Post> {
  const { data } = await apiClient.put<Post>(endpoints.post(id), post);
  return data;
}

export async function deletePost(id: string): Promise<Post> {
  const { data } = await apiClient.delete<Post>(endpoints.post(id));
  return data;
}
