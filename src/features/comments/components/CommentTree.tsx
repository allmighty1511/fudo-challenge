import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Textarea } from '@/components/ui/Textarea';
import { getAvatarForName } from '@/lib/avatars';
import { messages } from '@/lib/constants/messages';
import { buildCommentTree } from '@/lib/utils/buildCommentTree';
import { CommentActionsProvider } from '../contexts/CommentActionsContext';
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from '../hooks';
import { CommentItem } from './CommentItem';

interface CommentTreeProps {
  postId: string;
}

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
        {messages.errors.loadComments}
      </p>
    );
  }

  const actionsValue = {
    createComment,
    updateComment,
    deleteComment,
  };

  return (
    <CommentActionsProvider value={actionsValue}>
      <div className="space-y-6" data-testid="comment-tree">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          Comentarios {comments.length > 0 && `(${comments.length})`}
        </h3>

        <div className="space-y-3 p-4 bg-gray-50 rounded-[var(--radius-md)]">
        <Input
          placeholder="Tu nombre"
          value={newCommentName}
          onChange={(e) => setNewCommentName(e.target.value)}
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
          <Skeleton variant="comment" count={2} />
        </div>
      ) : (
        <div className="space-y-1">
          {tree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))}
          {tree.length === 0 && (
            <p className="text-sm text-[var(--color-text-muted)] py-4">
              {messages.empty.noComments}
            </p>
          )}
        </div>
      )}
      </div>
    </CommentActionsProvider>
  );
}
