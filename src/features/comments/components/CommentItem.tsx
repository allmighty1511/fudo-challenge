import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { OptionsMenu } from '@/components/ui/Dropdown';
import { formatDate } from '@/lib/utils/formatDate';
import { useCommentActions } from '../contexts/CommentActionsContext';
import type { CommentWithReplies } from '../types';
import { CommentEditForm } from './CommentEditForm';
import { CommentReplyForm } from './CommentReplyForm';

interface CommentItemProps {
  comment: CommentWithReplies;
  postId: string;
  depth?: number;
}

export function CommentItem({
  comment,
  postId,
  depth = 0,
}: CommentItemProps) {
  const { onReply, onEdit, onDelete, isReplying, isEditing } =
    useCommentActions();
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyName, setReplyName] = useState('');
  const [editContent, setEditContent] = useState(comment.content);

  const indent = Math.min(depth * 20, 80);
  const showEditForm = isEditingLocal;

  const handleSubmitReply = () => {
    if (!replyContent.trim() || !replyName.trim()) return;
    onReply(
      comment.id,
      { content: replyContent.trim(), name: replyName.trim() },
      {
        onSuccess: () => {
          setReplyContent('');
          setReplyName('');
          setIsReplyFormOpen(false);
        },
      }
    );
  };

  const handleSubmitEdit = () => {
    if (editContent.trim() === comment.content) {
      setIsEditingLocal(false);
      return;
    }
    onEdit(comment.id, editContent.trim(), {
      onSuccess: () => setIsEditingLocal(false),
    });
  };

  const handleDelete = () => {
    onDelete(comment.id, comment.replies.length > 0);
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
              {formatDate(comment.createdAt, 'long')}
            </span>
            <OptionsMenu
              onEdit={() => setIsEditingLocal(true)}
              onDelete={handleDelete}
              align="left"
              size="sm"
            />
          </div>

          {showEditForm ? (
            <CommentEditForm
              value={editContent}
              onChange={setEditContent}
              onSubmit={handleSubmitEdit}
              onCancel={() => {
                setIsEditingLocal(false);
                setEditContent(comment.content);
              }}
              isLoading={isEditing}
            />
          ) : (
            <p className="mt-1 text-sm text-[var(--color-text)] whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {!showEditForm && (
            <button
              type="button"
              onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}
              className="mt-2 text-xs text-[var(--color-accent)] hover:underline"
            >
              {isReplyFormOpen ? 'Cancelar' : 'Responder'}
            </button>
          )}

          {isReplyFormOpen && (
            <CommentReplyForm
              name={replyName}
              content={replyContent}
              onNameChange={setReplyName}
              onContentChange={setReplyContent}
              onSubmit={handleSubmitReply}
              onCancel={() => {
                setIsReplyFormOpen(false);
                setReplyContent('');
                setReplyName('');
              }}
              isLoading={isReplying}
            />
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
