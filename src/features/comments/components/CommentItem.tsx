import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { OptionsMenu } from '@/components/ui/Dropdown';
import { getAvatarForName } from '@/lib/avatars';
import { messages } from '@/lib/constants/messages';
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
  const { createComment, updateComment, deleteComment } = useCommentActions();
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
        },
      }
    );
  };

  const handleDelete = () => {
    const msg =
      comment.replies.length > 0
        ? messages.confirm.deleteCommentWithReplies
        : messages.confirm.deleteComment;
    if (window.confirm(msg)) {
      deleteComment.mutate(comment.id);
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
              {formatDate(comment.createdAt, 'long')}
            </span>
            <OptionsMenu
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
              align="left"
              size="sm"
            />
          </div>

          {isEditing ? (
            <CommentEditForm
              value={editContent}
              onChange={setEditContent}
              onSubmit={handleSubmitEdit}
              onCancel={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              isLoading={updateComment.isPending}
            />
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
            <CommentReplyForm
              name={replyName}
              content={replyContent}
              onNameChange={setReplyName}
              onContentChange={setReplyContent}
              onSubmit={handleSubmitReply}
              onCancel={() => {
                setIsReplying(false);
                setReplyContent('');
                setReplyName('');
              }}
              isLoading={createComment.isPending}
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
