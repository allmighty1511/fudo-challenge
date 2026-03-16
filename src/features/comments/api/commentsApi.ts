import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { Comment } from '@/types';

/** Obtiene los IDs de todos los descendientes de un comentario (recursivo). */
export function getDescendantIds(comments: Comment[], parentId: string): string[] {
  const ids: string[] = [];
  for (const c of comments) {
    if (c.parentId === parentId) {
      ids.push(c.id);
      ids.push(...getDescendantIds(comments, c.id));
    }
  }
  return ids;
}

export async function getComments(postId: string): Promise<Comment[]> {
  try {
    const { data } = await apiClient.get<Comment[]>(endpoints.comments(postId));
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return [];
    }
    throw err;
  }
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
