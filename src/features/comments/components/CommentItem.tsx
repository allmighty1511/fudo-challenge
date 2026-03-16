import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import type { CommentWithReplies } from '../types';

interface CommentItemProps {
  comment: CommentWithReplies;
  postId: string;
  depth?: number;
  onReply: (parentId: string | null, content: string, name: string, avatar: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  createComment: ReturnType<typeof import('../hooks/useCreateComment').useCreateComment>;
  updateComment: ReturnType<typeof import('../hooks/useUpdateComment').useUpdateComment>;
  deleteComment: ReturnType<typeof import('../hooks/useDeleteComment').useDeleteComment>;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

import { getAvatarForName } from '@/lib/avatars';

export function CommentItem({
  comment,
  postId,
  depth = 0,
  onReply,
  onEdit,
  onDelete,
  createComment,
  updateComment,
  deleteComment,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyName, setReplyName] = useState('');
  const [editContent, setEditContent] = useState(comment.content);

  const indent = Math.min(depth * 20, 80);

  const handleSubmitReply = () => {
    if (!replyContent.trim() || !replyName.trim()) return;
    const name = replyName.trim();
    createComment.mutate(
      {
        content: replyContent.trim(),
        name,
        avatar: getAvatarForName(name),
        parentId: comment.id,
      },
      {
        onSuccess: () => {
          setReplyContent('');
          setReplyName('');
          setIsReplying(false);
          onReply(comment.id, replyContent, name, getAvatarForName(name));
        },
      }
    );
  };

  const handleSubmitEdit = () => {
    if (editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    updateComment.mutate(
      { commentId: comment.id, comment: { content: editContent.trim() } },
      {
        onSuccess: () => {
          setIsEditing(false);
          onEdit(comment.id, editContent);
        },
      }
    );
  };

  const handleDelete = () => {
    const msg =
      comment.replies.length > 0
        ? '¿Eliminar este comentario y todas sus respuestas?'
        : '¿Eliminar este comentario?';
    if (window.confirm(msg)) {
      deleteComment.mutate(comment.id);
      onDelete(comment.id);
    }
  };

  return (
    <div
      className="py-3"
      style={{ marginLeft: indent > 0 ? `${indent}px` : undefined }}
    >
      <div className="flex gap-3">
        <Avatar src={comment.avatar} alt={comment.name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[var(--color-text)]">
              {comment.name}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {formatDate(comment.createdAt)}
            </span>
            <Dropdown
              trigger={
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-100 text-[var(--color-text-muted)] text-xs"
                  aria-label="Opciones"
                >
                  ···
                </button>
              }
              align="left"
            >
              <DropdownItem onClick={() => setIsEditing(true)}>
                Editar
              </DropdownItem>
              <DropdownItem variant="danger" onClick={handleDelete}>
                Eliminar
              </DropdownItem>
            </Dropdown>
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitEdit();
                  }
                }}
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmitEdit} isLoading={updateComment.isPending}>
                  Guardar
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-[var(--color-text)] whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsReplying(!isReplying)}
              className="mt-2 text-xs text-[var(--color-accent)] hover:underline"
            >
              {isReplying ? 'Cancelar' : 'Responder'}
            </button>
          )}

          {isReplying && (
            <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-[var(--radius-md)]">
              <input
                type="text"
                placeholder="Tu nombre"
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--color-border)]"
              />
              <Textarea
                placeholder="Escribe tu respuesta..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply();
                  }
                }}
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmitReply} isLoading={createComment.isPending}>
                  Responder
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent('');
                    setReplyName('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="mt-2 border-l-2 border-[var(--color-border)] pl-4 ml-6">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              createComment={createComment}
              updateComment={updateComment}
              deleteComment={deleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
