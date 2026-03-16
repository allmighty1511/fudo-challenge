import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { CommentItem } from './CommentItem';
import { buildCommentTree } from '@/lib/utils/buildCommentTree';
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from '../hooks';

interface CommentTreeProps {
  postId: string;
}

import { getAvatarForName } from '@/lib/avatars';

export function CommentTree({ postId }: CommentTreeProps) {
  const { data: comments = [], isLoading, error } = useComments(postId);
  const createComment = useCreateComment(postId);
  const updateComment = useUpdateComment(postId);
  const deleteComment = useDeleteComment(postId);

  const [newCommentContent, setNewCommentContent] = useState('');
  const [newCommentName, setNewCommentName] = useState('');

  const tree = buildCommentTree(comments);

  const handleSubmitNew = () => {
    if (!newCommentContent.trim() || !newCommentName.trim()) return;
    const name = newCommentName.trim();
    createComment.mutate(
      {
        content: newCommentContent.trim(),
        name,
        avatar: getAvatarForName(name),
        parentId: null,
      },
      {
        onSuccess: () => {
          setNewCommentContent('');
          setNewCommentName('');
        },
      }
    );
  };

  if (error) {
    return (
      <p className="text-[var(--color-error)] text-sm">
        Error al cargar los comentarios.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--color-text)]">
        Comentarios {comments.length > 0 && `(${comments.length})`}
      </h3>

      <div className="space-y-3 p-4 bg-gray-50 rounded-[var(--radius-md)]">
        <input
          type="text"
          placeholder="Tu nombre"
          value={newCommentName}
          onChange={(e) => setNewCommentName(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
        />
        <Textarea
          placeholder="Escribe un comentario..."
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmitNew();
            }
          }}
          rows={3}
        />
        <Button
          size="sm"
          onClick={handleSubmitNew}
          isLoading={createComment.isPending}
        >
          Comentar
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 animate-pulse rounded-[var(--radius-md)]"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {tree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReply={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
              createComment={createComment}
              updateComment={updateComment}
              deleteComment={deleteComment}
            />
          ))}
          {tree.length === 0 && (
            <p className="text-sm text-[var(--color-text-muted)] py-4">
              No hay comentarios aún. ¡Sé el primero en comentar!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
