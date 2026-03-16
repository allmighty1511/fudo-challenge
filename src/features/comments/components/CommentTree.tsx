import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Textarea } from '@/components/ui/Textarea';
import { messages } from '@/lib/constants/messages';
import type { CommentWithReplies } from '../types';
import { CommentItem } from './CommentItem';

interface CommentTreeProps {
  tree: CommentWithReplies[];
  commentCount: number;
  isLoading: boolean;
  error: boolean;
  newCommentName: string;
  newCommentContent: string;
  onNewCommentNameChange: (value: string) => void;
  onNewCommentContentChange: (value: string) => void;
  onSubmitNew: () => void;
  isSubmitting: boolean;
  postId: string;
}

export function CommentTree({
  tree,
  commentCount,
  isLoading,
  error,
  newCommentName,
  newCommentContent,
  onNewCommentNameChange,
  onNewCommentContentChange,
  onSubmitNew,
  isSubmitting,
  postId,
}: CommentTreeProps) {
  if (error) {
    return (
      <p className="text-[var(--color-error)] text-sm">
        {messages.errors.loadComments}
      </p>
    );
  }

  return (
    <div className="space-y-6" data-testid="comment-tree">
      <h3 className="text-lg font-semibold text-[var(--color-text)]">
        Comentarios {commentCount > 0 && `(${commentCount})`}
      </h3>

      <div className="space-y-3 p-4 bg-gray-50 rounded-[var(--radius-md)]">
        <Input
          placeholder="Tu nombre"
          value={newCommentName}
          onChange={(e) => onNewCommentNameChange(e.target.value)}
        />
        <Textarea
          placeholder="Escribe un comentario..."
          value={newCommentContent}
          onChange={(e) => onNewCommentContentChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmitNew();
            }
          }}
          rows={3}
        />
        <Button
          size="sm"
          onClick={onSubmitNew}
          isLoading={isSubmitting}
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
  );
}
