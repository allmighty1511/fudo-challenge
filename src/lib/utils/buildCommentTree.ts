import type { Comment } from '@/types';

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

export function buildCommentTree(comments: Comment[]): CommentWithReplies[] {
  const map = new Map<string, CommentWithReplies>();

  comments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });

  const roots: CommentWithReplies[] = [];

  comments.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parentId === null) {
      roots.push(node);
    } else {
      const parent = map.get(c.parentId);
      if (parent) {
        parent.replies.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  return roots;
}
