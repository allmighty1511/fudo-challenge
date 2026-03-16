import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { Comment } from '@/types';

export async function getComments(postId: string): Promise<Comment[]> {
  const { status, data } = await apiClient.get<Comment[]>(
    endpoints.comments(postId),
    { validateStatus: (s) => s === 200 || s === 404 }
  );
  if (status === 404) return [];
  return Array.isArray(data) ? data : [];
}

export async function createComment(
  postId: string,
  comment: Partial<Comment>
): Promise<Comment> {
  const { data } = await apiClient.post<Comment>(
    endpoints.comments(postId),
    comment
  );
  return data;
}

export async function updateComment(
  postId: string,
  commentId: string,
  comment: Partial<Comment>
): Promise<Comment> {
  const { data } = await apiClient.put<Comment>(
    endpoints.comment(postId, commentId),
    comment
  );
  return data;
}

export async function deleteComment(
  postId: string,
  commentId: string
): Promise<Comment> {
  const { data } = await apiClient.delete<Comment>(
    endpoints.comment(postId, commentId)
  );
  return data;
}
